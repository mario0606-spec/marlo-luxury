import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
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

    // Use billing_cycle_anchor as a stand-in for period start; period end is 1 month out
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

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const rentalId = session.metadata?.rentalId;
  if (!rentalId) return;

  await prisma.rental.updateMany({
    where: { id: rentalId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  // Handles direct Payment Intent usage (Checkout-originated PIs are handled by checkout.session.completed)
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
  // In Stripe v22, subscription ID is in invoice.parent.subscription_details.subscription
  const subscriptionId = (() => {
    const parent = invoice.parent as (Stripe.Invoice["parent"] & {
      subscription_details?: { subscription?: string | { id: string } };
    }) | null;
    const sub = parent?.subscription_details?.subscription;
    if (!sub) return null;
    return typeof sub === "string" ? sub : sub.id;
  })();

  if (!subscriptionId) return;

  // Update subscription status and period from invoice dates
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
