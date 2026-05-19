import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";

const schema = z.object({
  rentalId: z.string(),
  itemId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { rentalId, itemId } = parsed.data;

  const [rental, item] = await Promise.all([
    prisma.rental.findUnique({ where: { id: rentalId } }),
    prisma.item.findUnique({ where: { id: itemId }, select: { id: true, name: true, brand: true, images: true, purchasable: true, purchasePrice: true } }),
  ]);

  if (!rental || rental.userId !== userId) {
    return NextResponse.json({ error: "Rental not found or access denied" }, { status: 404 });
  }
  if (!item || !item.purchasable || !item.purchasePrice) {
    return NextResponse.json({ error: "Item is not available for purchase" }, { status: 409 });
  }
  if (rental.convertedToPurchaseAt) {
    return NextResponse.json({ error: "Already converted to purchase" }, { status: 409 });
  }

  const creditAmount = rental.purchaseCreditAmount ?? rental.totalAmount;
  const finalAmount = Math.max(0, item.purchasePrice - creditAmount);

  // If fully covered by credit, handle without Stripe
  if (finalAmount === 0) {
    const conversion = await prisma.purchaseConversion.create({
      data: {
        rentalId,
        itemId: item.id,
        userId,
        purchasePrice: item.purchasePrice,
        creditApplied: creditAmount,
        finalAmount: 0,
        status: "PAID",
      },
    });
    await prisma.rental.update({
      where: { id: rentalId },
      data: { convertedToPurchaseAt: new Date() },
    });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.json({ url: `${appUrl}/purchase/success?conversionId=${conversion.id}` });
  }

  const customerId = await getOrCreateStripeCustomer(userId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${item.brand} ${item.name} — Purchase`,
            description: `Includes rental credit of €${(creditAmount / 100).toFixed(0)}`,
            images: item.images.length > 0 ? [item.images[0]] : undefined,
          },
          unit_amount: finalAmount,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      metadata: { type: "purchase_conversion", rentalId, itemId: item.id, userId, creditAmount: String(creditAmount) },
    },
    metadata: { type: "purchase_conversion", rentalId, itemId: item.id, userId, creditAmount: String(creditAmount) },
    success_url: `${appUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/purchase/${item.id}?rentalId=${rentalId}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
