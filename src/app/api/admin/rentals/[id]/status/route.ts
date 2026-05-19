import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendDispatchEmail } from "@/lib/email";

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
      item: { select: { name: true, brand: true } },
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

  return NextResponse.json(updated);
}
