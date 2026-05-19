import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, getOrCreateStripeCustomer, WAIVER_AMOUNT_CENTS } from "@/lib/stripe";

const checkoutSchema = z.object({
  rentalId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  const { rentalId } = parsed.data;

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: {
      item: { select: { name: true, brand: true, images: true } },
    },
  });

  if (!rental) {
    return NextResponse.json({ error: "Rental not found" }, { status: 404 });
  }
  if (rental.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (rental.status !== "PENDING") {
    return NextResponse.json({ error: "Rental is not pending payment" }, { status: 409 });
  }

  const start = rental.startDate;
  const end = rental.endDate;
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const customerId = await getOrCreateStripeCustomer(userId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItems: any[] = [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: `${rental.item.name} Rental`,
          description: `${rental.item.brand} — ${days} day${days !== 1 ? "s" : ""} (${start.toLocaleDateString()} – ${end.toLocaleDateString()})`,
          images: rental.item.images.length > 0 ? [rental.item.images[0]] : undefined,
        },
        unit_amount: rental.totalAmount,
      },
      quantity: 1,
    },
  ];

  // If waiver purchased, add it as a line item (replaces deposit hold)
  if (rental.waiverPurchased && rental.waiverAmount) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "marianni Schutz — Damage Waiver",
          description: "Covers accidental damage up to €500. No deposit hold on your card.",
        },
        unit_amount: WAIVER_AMOUNT_CENTS,
      },
      quantity: 1,
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: lineItems,
    payment_intent_data: {
      // Save card off-session so we can create the deposit hold after checkout
      setup_future_usage: rental.waiverPurchased ? undefined : "off_session",
      metadata: { rentalId, userId },
    },
    metadata: { rentalId, userId },
    success_url: `${appUrl}/checkout/success?rentalId=${rentalId}`,
    cancel_url: `${appUrl}/checkout/cancel?rentalId=${rentalId}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
