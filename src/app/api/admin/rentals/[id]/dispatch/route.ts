import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDispatchConditionEmail } from "@/lib/email";

const dispatchSchema = z.object({
  photos: z.array(z.string().min(10)).min(2, "At least 2 photos required"),
  notes: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId || userRole !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = dispatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const { photos, notes } = parsed.data;

  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      item: { select: { name: true, brand: true } },
      conditionLogs: { where: { type: "DISPATCH" } },
    },
  });

  if (!rental) {
    return NextResponse.json({ error: "Rental not found" }, { status: 404 });
  }

  if (rental.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: `Cannot dispatch rental in status ${rental.status}. Must be CONFIRMED.` },
      { status: 409 }
    );
  }

  if (rental.conditionLogs.length > 0) {
    return NextResponse.json({ error: "Dispatch condition log already exists" }, { status: 409 });
  }

  const [conditionLog] = await prisma.$transaction([
    prisma.conditionLog.create({
      data: {
        rentalId: id,
        type: "DISPATCH",
        photos,
        notes,
        capturedBy: userId,
      },
    }),
    prisma.rental.update({
      where: { id },
      data: { status: "DISPATCHED" },
    }),
  ]);

  // Fire-and-forget dispatch email with first photo
  sendDispatchConditionEmail(rental.user.email, {
    rentalId: rental.id,
    itemName: rental.item.name,
    brand: rental.item.brand,
    dispatchPhoto: photos[0],
  }).catch((err) => console.error("Dispatch condition email failed:", err));

  return NextResponse.json({ conditionLogId: conditionLog.id, status: "DISPATCHED" }, { status: 201 });
}
