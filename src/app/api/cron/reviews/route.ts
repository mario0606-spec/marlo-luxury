import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReviewRequestEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

  // Find rentals returned 2 days ago that have no review and no email sent yet
  const rentals = await prisma.rental.findMany({
    where: {
      status: "RETURNED",
      updatedAt: { gte: twoDaysAgo, lt: oneDayAgo },
      review: null,
    },
    include: {
      user: { select: { email: true, name: true } },
      item: { select: { name: true, brand: true, slug: true } },
    },
  });

  let sent = 0;
  for (const rental of rentals) {
    if (!rental.user.email) continue;
    try {
      await sendReviewRequestEmail(rental.user.email, {
        rentalId: rental.id,
        itemName: rental.item.name,
        brand: rental.item.brand,
        itemSlug: rental.item.slug,
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send review request for rental ${rental.id}:`, err);
    }
  }

  return NextResponse.json({ sent, total: rentals.length });
}
