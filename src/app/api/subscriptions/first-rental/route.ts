import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendFirstWatchConfirmationEmail } from "@/lib/email";

const firstRentalSchema = z.object({
  itemId: z.string().cuid(),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = firstRentalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const { itemId, shippingAddress } = parsed.data;

  // Verify active subscription
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] } },
    orderBy: { createdAt: "desc" },
  });
  if (!subscription) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  // Check item availability
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true, name: true, brand: true, available: true, dailyRate: true, monthlyRate: true, depositAmount: true },
  });
  if (!item || !item.available) {
    return NextResponse.json({ error: "Item unavailable" }, { status: 409 });
  }

  // Subscription rental: 30-day period from today
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  // Check for overlapping rentals on this item
  const conflict = await prisma.rental.findFirst({
    where: {
      itemId,
      status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
      startDate: { lt: endDate },
      endDate: { gt: startDate },
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "Item already booked for this period" }, { status: 409 });
  }

  const totalAmount = item.monthlyRate ?? item.dailyRate * 30;

  const rental = await prisma.rental.create({
    data: {
      userId,
      itemId,
      status: "CONFIRMED",
      startDate,
      endDate,
      totalAmount,
      depositAmount: item.depositAmount,
      shippingAddress,
      subscriptionId: subscription.id,
      notes: "First subscription delivery",
    },
  });

  // Send confirmation email
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  if (user?.email) {
    const estimatedDelivery = new Date(startDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    await sendFirstWatchConfirmationEmail(user.email, {
      rentalId: rental.id,
      userName: user.name ?? "Member",
      itemName: item.name,
      brand: item.brand,
      estimatedDelivery: estimatedDelivery.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      returnWindow: endDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      shippingAddress,
    }).catch(() => {/* non-blocking */});
  }

  return NextResponse.json({ rentalId: rental.id });
}
