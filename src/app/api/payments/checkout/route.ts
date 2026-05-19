import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";

const checkoutSchema = z.object({
  itemId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
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

  const { itemId, startDate, endDate } = parsed.data;

  const item = await prisma.item.findUnique({ where: { id: itemId, available: true } });
  if (!item) {
    return NextResponse.json({ error: "Item not available" }, { status: 404 });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const rentalAmount = item.dailyRate * days;
  const totalAmount = rentalAmount + item.depositAmount;

  const rental = await prisma.rental.create({
    data: {
      userId,
      itemId,
      startDate: start,
      endDate: end,
      totalAmount,
      depositAmount: item.depositAmount,
      status: "PENDING",
    },
  });

  const customerId = await getOrCreateStripeCustomer(userId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} Rental`,
            description: `${item.brand} — ${days} day${days !== 1 ? "s" : ""} (${start.toLocaleDateString()} – ${end.toLocaleDateString()})`,
            images: item.images.length > 0 ? [item.images[0]] : undefined,
          },
          unit_amount: rentalAmount,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Refundable Deposit",
            description: "Fully refunded upon safe return of the item",
          },
          unit_amount: item.depositAmount,
        },
        quantity: 1,
      },
    ],
    metadata: { rentalId: rental.id, userId },
    success_url: `${appUrl}/checkout/success?rentalId=${rental.id}`,
    cancel_url: `${appUrl}/checkout/cancel?rentalId=${rental.id}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30-minute window
  });

  return NextResponse.json({ url: checkoutSession.url });
}
