import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email";

const shippingSchema = z.object({
  fullName: z.string().min(2),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2),
  phone: z.string().optional(),
});

const createRentalSchema = z.object({
  itemId: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  shippingAddress: shippingSchema,
});

function calcTotalCents(dailyRate: number, weeklyRate: number | null, monthlyRate: number | null, days: number): number {
  if (monthlyRate && days >= 28) {
    const months = Math.floor(days / 30);
    const remainder = days % 30;
    return months * monthlyRate + remainder * dailyRate;
  }
  if (weeklyRate && days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainder = days % 7;
    return weeks * weeklyRate + remainder * dailyRate;
  }
  return days * dailyRate;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createRentalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const { itemId, startDate, endDate, shippingAddress } = parsed.data;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) {
    return NextResponse.json({ error: "End date must be after start date" }, { status: 422 });
  }
  if (start < new Date(new Date().toDateString())) {
    return NextResponse.json({ error: "Start date cannot be in the past" }, { status: 422 });
  }

  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true, name: true, brand: true, dailyRate: true, weeklyRate: true, monthlyRate: true, depositAmount: true, available: true },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  if (!item.available) {
    return NextResponse.json({ error: "Item is not available for rental" }, { status: 409 });
  }

  // Double-booking check — atomic with transaction
  const rental = await prisma.$transaction(async (tx) => {
    const overlap = await tx.rental.findFirst({
      where: {
        itemId,
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
    });

    if (overlap) {
      throw new Error("DOUBLE_BOOKING");
    }

    const totalAmount = calcTotalCents(item.dailyRate, item.weeklyRate, item.monthlyRate, days);

    return tx.rental.create({
      data: {
        userId,
        itemId,
        startDate: start,
        endDate: end,
        totalAmount,
        depositAmount: item.depositAmount,
        shippingAddress,
        status: "PENDING",
      },
      include: {
        item: { select: { name: true, brand: true, slug: true } },
        user: { select: { email: true, name: true } },
      },
    });
  });

  // Fire-and-forget confirmation email
  sendBookingConfirmationEmail(rental.user.email, {
    rentalId: rental.id,
    itemName: rental.item.name,
    brand: rental.item.brand,
    startDate,
    endDate,
    days,
    totalAmount: rental.totalAmount,
    depositAmount: rental.depositAmount,
    shippingAddress,
  }).catch((err) => console.error("Booking email failed:", err));

  return NextResponse.json({ rentalId: rental.id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const take = 20;
  const skip = (page - 1) * take;

  const [rentals, total] = await Promise.all([
    prisma.rental.findMany({
      where: { userId },
      include: { item: { select: { name: true, brand: true, images: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.rental.count({ where: { userId } }),
  ]);

  return NextResponse.json({ rentals, total, page, pages: Math.ceil(total / take) });
}
