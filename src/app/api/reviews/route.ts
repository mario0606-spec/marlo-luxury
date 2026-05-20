import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/reviews?itemId=xxx
export async function GET(req: NextRequest) {
  const itemId = req.nextUrl.searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { itemId, status: "APPROVED" },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avg =
    reviews.length >= 3
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  return NextResponse.json({ reviews, avg, count: reviews.length });
}

// POST /api/reviews
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { rentalId, rating, reviewBody, occasion } = body;

  if (!rentalId || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rentalId and rating (1–5) required" }, { status: 400 });
  }
  if (reviewBody && reviewBody.length > 0 && reviewBody.length < 20) {
    return NextResponse.json({ error: "Written review must be at least 20 characters" }, { status: 400 });
  }

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    select: { userId: true, itemId: true, status: true },
  });

  if (!rental) return NextResponse.json({ error: "Rental not found" }, { status: 404 });
  if (rental.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (rental.status !== "RETURNED") {
    return NextResponse.json({ error: "Can only review completed rentals" }, { status: 400 });
  }

  const existing = await prisma.review.findUnique({ where: { rentalId } });
  if (existing) return NextResponse.json({ error: "Review already submitted for this rental" }, { status: 409 });

  const review = await prisma.review.create({
    data: {
      userId,
      itemId: rental.itemId,
      rentalId,
      rating,
      body: reviewBody?.trim() || null,
      occasion: occasion?.trim() || null,
      verifiedRental: true,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
