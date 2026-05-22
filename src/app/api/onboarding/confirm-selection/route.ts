import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOnboardingConfirmationEmail } from "@/lib/email";

const confirmSchema = z.object({
  itemId: z.string().min(1),
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
  const userId = (session?.user as { id?: string; email?: string } | undefined)?.id;
  const userEmail = (session?.user as { id?: string; email?: string } | undefined)?.email;
  if (!userId || !userEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const { itemId, shippingAddress } = parsed.data;

  // Validate item exists and is available
  const item = await prisma.item.findUnique({ where: { id: itemId, available: true } });
  if (!item) return NextResponse.json({ error: "Item not available" }, { status: 400 });

  // Find active subscription
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] } },
    orderBy: { createdAt: "desc" },
  });
  if (!subscription) return NextResponse.json({ error: "No active subscription" }, { status: 400 });

  // Create rental for 30 days (one subscription cycle)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  const rental = await prisma.rental.create({
    data: {
      userId,
      itemId,
      subscriptionId: subscription.id,
      status: "CONFIRMED",
      startDate,
      endDate,
      totalAmount: item.monthlyRate ?? item.weeklyRate ?? item.dailyRate * 30,
      depositAmount: item.depositAmount,
      shippingAddress,
      notes: "First subscription delivery",
    },
  });

  // Mark onboarding as completed
  await prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  });

  // Send confirmation email
  try {
    await sendOnboardingConfirmationEmail(userEmail, {
      rentalId: rental.id,
      itemName: item.name,
      brand: item.brand,
      endDate: endDate.toLocaleDateString("de-DE"),
      shippingAddress,
    });
  } catch {
    // Email failure is non-fatal
  }

  return NextResponse.json({ rental });
}
