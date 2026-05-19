import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { releaseDepositHold, captureDepositHold } from "@/lib/stripe";

const depositActionSchema = z.object({
  action: z.enum(["release", "capture"]),
  captureAmount: z.number().int().positive().optional(), // in cents, for partial capture
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id: rentalId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = depositActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  const { action, captureAmount } = parsed.data;

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    select: {
      depositIntentId: true,
      depositAmount: true,
      depositCaptured: true,
      depositRefunded: true,
      waiverPurchased: true,
    },
  });

  if (!rental) {
    return NextResponse.json({ error: "Rental not found" }, { status: 404 });
  }
  if (rental.waiverPurchased) {
    return NextResponse.json({ error: "Waiver was purchased — no deposit hold to manage" }, { status: 409 });
  }
  if (!rental.depositIntentId) {
    return NextResponse.json({ error: "No deposit hold found for this rental" }, { status: 404 });
  }
  if (rental.depositCaptured) {
    return NextResponse.json({ error: "Deposit already captured" }, { status: 409 });
  }
  if (rental.depositRefunded) {
    return NextResponse.json({ error: "Deposit already released" }, { status: 409 });
  }

  if (action === "release") {
    await releaseDepositHold(rental.depositIntentId);
    await prisma.rental.update({
      where: { id: rentalId },
      data: { depositRefunded: true },
    });
    return NextResponse.json({ success: true, action: "released" });
  }

  // capture
  const amountToCapture = captureAmount ?? rental.depositAmount;
  await captureDepositHold(rental.depositIntentId, amountToCapture);
  await prisma.rental.update({
    where: { id: rentalId },
    data: {
      depositCaptured: true,
      depositCaptureAmount: amountToCapture,
    },
  });
  return NextResponse.json({ success: true, action: "captured", amountCaptured: amountToCapture });
}
