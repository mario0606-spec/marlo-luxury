import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, createDepositHold } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired":
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "identity.verification_session.verified":
        await handleIdentityVerified(event.data.object as Stripe.Identity.VerificationSession);
        break;

      case "identity.verification_session.requires_input":
        await handleIdentityRequiresInput(event.data.object as Stripe.Identity.VerificationSession);
        break;
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode === "payment") {
    const rentalId = session.metadata?.rentalId;
    if (!rentalId) return;

    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : null;

    await prisma.rental.update({
      where: { id: rentalId },
      data: {
        status: "CONFIRMED",
        ...(paymentIntentId ? { stripePaymentId: paymentIntentId } : {}),
      },
    });

    console.log(`Rental ${rentalId} confirmed via checkout session ${session.id}`);

    // Create deposit hold if waiver was NOT purchased
    if (paymentIntentId) {
      await createDepositHoldForRental(rentalId, paymentIntentId, session);
    }

    return;
  }

  if (session.mode === "subscription") {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as SubscriptionPlan | undefined;
    const stripeSubscriptionId =
      typeof session.subscription === "string" ? session.subscription : null;
    const stripeCustomerId =
      typeof session.customer === "string" ? session.customer : null;

    if (!userId || !plan || !stripeSubscriptionId) return;

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId },
      create: {
        userId,
        plan,
        status: "ACTIVE",
        stripeSubscriptionId,
        stripeCustomerId,
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
      },
      update: {
        status: "ACTIVE",
        stripeCustomerId,
      },
    });

    console.log(`Subscription ${stripeSubscriptionId} activated for user ${userId}`);
  }
}

async function createDepositHoldForRental(
  rentalId: string,
  paymentIntentId: string,
  session: Stripe.Checkout.Session
): Promise<void> {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    select: { waiverPurchased: true, depositAmount: true, depositIntentId: true },
  });

  if (!rental || rental.waiverPurchased || rental.depositIntentId) {
    return; // waiver purchased, or deposit already set up
  }

  const customerId = typeof session.customer === "string" ? session.customer : null;
  if (!customerId) {
    console.error(`No customer ID for checkout session ${session.id} — cannot create deposit hold`);
    return;
  }

  // Get the payment method from the payment intent (saved via setup_future_usage)
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  const paymentMethodId = typeof pi.payment_method === "string" ? pi.payment_method : null;

  if (!paymentMethodId) {
    console.error(`No saved payment method on PaymentIntent ${paymentIntentId} — cannot create deposit hold`);
    return;
  }

  try {
    const depositIntentId = await createDepositHold(
      customerId,
      paymentMethodId,
      rental.depositAmount,
      rentalId
    );

    await prisma.rental.update({
      where: { id: rentalId },
      data: { depositIntentId },
    });

    console.log(`Deposit hold ${depositIntentId} created for rental ${rentalId}`);
  } catch (err) {
    // Non-fatal: rental is confirmed, deposit hold failed. Log for admin follow-up.
    console.error(`Failed to create deposit hold for rental ${rentalId}:`, err);
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const rentalId = session.metadata?.rentalId;
  if (!rentalId) return;

  await prisma.rental.updateMany({
    where: { id: rentalId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  // Deposit hold captured by admin — update rental
  if (pi.metadata?.type === "deposit_hold") {
    const rentalId = pi.metadata?.rentalId;
    if (rentalId) {
      await prisma.rental.updateMany({
        where: { id: rentalId },
        data: {
          depositCaptured: true,
          depositCaptureAmount: pi.amount_received,
        },
      });
    }
    return;
  }

  // Regular rental payment
  await prisma.rental.updateMany({
    where: { stripePaymentId: pi.id, status: "PENDING" },
    data: { status: "CONFIRMED" },
  });
  await prisma.order.updateMany({
    where: { stripePaymentId: pi.id, status: "PENDING" },
    data: { status: "PAID" },
  });
}

async function handlePaymentIntentFailed(pi: Stripe.PaymentIntent) {
  await prisma.rental.updateMany({
    where: { stripePaymentId: pi.id },
    data: { status: "CANCELLED" },
  });
  await prisma.order.updateMany({
    where: { stripePaymentId: pi.id },
    data: { status: "CANCELLED" },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (() => {
    const parent = invoice.parent as (Stripe.Invoice["parent"] & {
      subscription_details?: { subscription?: string | { id: string } };
    }) | null;
    const sub = parent?.subscription_details?.subscription;
    if (!sub) return null;
    return typeof sub === "string" ? sub : sub.id;
  })();

  if (!subscriptionId) return;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: "ACTIVE",
      currentPeriodStart: new Date(invoice.period_start * 1000),
      currentPeriodEnd: new Date(invoice.period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: { status: "CANCELLED", canceledAt: new Date() },
  });
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  type SubStatus = "ACTIVE" | "PAST_DUE" | "CANCELLED" | "PAUSED";
  const statusMap: Record<string, SubStatus> = {
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELLED",
    paused: "PAUSED",
  };

  const status = statusMap[sub.status];
  if (!status) return;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: {
      status,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });
}

async function handleIdentityVerified(verificationSession: Stripe.Identity.VerificationSession) {
  const userId = verificationSession.metadata?.userId;
  if (!userId) {
    console.error(`No userId in identity verification session ${verificationSession.id}`);
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "VERIFIED",
      stripeVerificationSessionId: verificationSession.id,
    },
  });

  console.log(`KYC verified for user ${userId} via session ${verificationSession.id}`);
}

async function handleIdentityRequiresInput(verificationSession: Stripe.Identity.VerificationSession) {
  const userId = verificationSession.metadata?.userId;
  if (!userId) return;

  // Mark as rejected only if there was a previous failure (not just a pending state)
  const lastError = verificationSession.last_error;
  if (lastError) {
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "REJECTED" },
    });
    console.log(`KYC rejected for user ${userId}: ${lastError.code}`);
  }
}
