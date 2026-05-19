import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPurchaseOfferEmail } from "@/lib/email";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

const schema = z.object({
  rentalId: z.string(),
});

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const rental = await prisma.rental.findUnique({
    where: { id: parsed.data.rentalId },
    include: {
      user: { select: { email: true } },
      item: { select: { id: true, name: true, brand: true, purchasable: true, purchasePrice: true } },
    },
  });

  if (!rental) return NextResponse.json({ error: "Rental not found" }, { status: 404 });

  const creditAmount = rental.purchaseCreditAmount ?? rental.totalAmount;
  const purchasePrice = rental.item.purchasePrice ?? 0;
  const finalPrice = Math.max(0, purchasePrice - creditAmount);

  await sendPurchaseOfferEmail(rental.user.email, {
    rentalId: rental.id,
    itemId: rental.item.id,
    itemName: rental.item.name,
    brand: rental.item.brand,
    purchasePrice,
    creditAmount,
    finalPrice,
    purchasable: rental.item.purchasable && purchasePrice > 0,
  });

  await prisma.rental.update({
    where: { id: rental.id },
    data: { purchaseLeadSentAt: new Date() },
  });

  return NextResponse.json({ sent: true });
}
