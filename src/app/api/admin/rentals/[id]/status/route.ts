import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendDispatchEmail, sendPurchaseOfferEmail, sendAvailabilityNotificationEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

const bodySchema = z.object({
  status: z.enum(["CONFIRMED", "ACTIVE", "RETURNED", "CANCELLED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      item: { select: { name: true, brand: true, slug: true, purchasable: true, purchasePrice: true } },
      user: { select: { email: true, name: true } },
      conditionLogs: { select: { phase: true, photos: true, status: true } },
    },
  });
  if (!rental) return NextResponse.json({ error: "Rental not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { status } = parsed.data;

  // Gate: cannot mark ACTIVE (dispatched) without dispatch condition log with >=2 photos
  if (status === "ACTIVE") {
    const dispatchLog = rental.conditionLogs.find((l) => l.phase === "DISPATCH");
    if (!dispatchLog || dispatchLog.photos.length < 2) {
      return NextResponse.json(
        { error: "Dispatch condition log with at least 2 photos is required before marking as dispatched." },
        { status: 422 }
      );
    }
  }

  // Gate: cannot mark RETURNED without return condition log with >=2 photos
  if (status === "RETURNED") {
    const returnLog = rental.conditionLogs.find((l) => l.phase === "RETURN");
    if (!returnLog || returnLog.photos.length < 2) {
      return NextResponse.json(
        { error: "Return condition log with at least 2 photos is required before marking as returned." },
        { status: 422 }
      );
    }
  }

  const updated = await prisma.rental.update({
    where: { id },
    data: { status },
  });

  // Send dispatch email when transitioning to ACTIVE
  if (status === "ACTIVE") {
    const dispatchLog = rental.conditionLogs.find((l) => l.phase === "DISPATCH");
    try {
      await sendDispatchEmail(rental.user.email, {
        rentalId: id,
        itemName: rental.item.name,
        brand: rental.item.brand,
        startDate: rental.startDate.toLocaleDateString("de-DE"),
        endDate: rental.endDate.toLocaleDateString("de-DE"),
        dispatchPhoto: dispatchLog?.photos[0] ?? null,
      });
    } catch (err) {
      console.error("Failed to send dispatch email:", err);
      // Non-blocking — don't fail the status update because of email
    }
  }

  // Check purchase lead trigger when rental is RETURNED
  if (status === "RETURNED") {
    try {
      await checkAndSendPurchaseOffer(id, rental.userId, rental.itemId, rental.totalAmount, rental.item, rental.user.email);
    } catch (err) {
      console.error("Failed to process purchase lead for rental", id, err);
    }

    // Mark item available and notify favoriting users
    try {
      await prisma.item.update({ where: { id: rental.itemId }, data: { available: true } });
      await notifyFavoritingUsers(rental.itemId, rental.item.name, rental.item.brand, rental.item.slug);
    } catch (err) {
      console.error("Failed to send availability notifications for item", rental.itemId, err);
    }
  }

  return NextResponse.json(updated);
}

async function checkAndSendPurchaseOffer(
  rentalId: string,
  userId: string,
  itemId: string,
  lastRentalAmount: number,
  item: { name: string; brand: string; purchasable: boolean; purchasePrice: number | null },
  email: string
) {
  // Count completed rentals by this user for this item (including the just-returned one)
  const completedCount = await prisma.rental.count({
    where: {
      userId,
      itemId,
      status: { in: ["RETURNED"] },
    },
  });

  if (completedCount < 2) return;

  // Check if offer was already sent for this rental chain
  const existingLead = await prisma.rental.findFirst({
    where: { userId, itemId, purchaseLeadSentAt: { not: null } },
  });
  if (existingLead) return;

  // Mark the current rental as having the lead sent
  await prisma.rental.update({
    where: { id: rentalId },
    data: {
      purchaseLeadSentAt: new Date(),
      purchaseCreditAmount: lastRentalAmount,
    },
  });

  const purchasePrice = item.purchasePrice ?? 0;
  const finalPrice = Math.max(0, purchasePrice - lastRentalAmount);

  await sendPurchaseOfferEmail(email, {
    rentalId,
    itemId,
    itemName: item.name,
    brand: item.brand,
    purchasePrice,
    creditAmount: lastRentalAmount,
    finalPrice,
    purchasable: item.purchasable && purchasePrice > 0,
  });

  console.log(`Purchase offer sent for rental ${rentalId} (${completedCount} rentals of item ${itemId})`);
}

async function notifyFavoritingUsers(itemId: string, itemName: string, brand: string, slug: string) {
  const favs = await prisma.favorite.findMany({
    where: { itemId },
    include: { user: { select: { email: true, availabilityEmailOptOut: true } } },
  });

  await Promise.allSettled(
    favs
      .filter((f) => !f.user.availabilityEmailOptOut)
      .map((f) =>
        sendAvailabilityNotificationEmail(f.user.email, { itemId, itemName, brand, slug })
      )
  );
}
