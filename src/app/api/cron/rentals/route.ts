import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendDeliveryConfirmationEmail,
  sendMidRentalCheckInEmail,
  sendReturnReminderEmail,
} from "@/lib/email";

// Vercel Cron calls this with a secret header.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = startOfDay(new Date());
  const in2Days = addDays(now, 2);
  const in3Days = addDays(now, 3);

  const results = { delivery: 0, midCheckin: 0, returnReminder: 0, errors: [] as string[] };

  // 1. Delivery confirmation — rental startDate is today, status DISPATCHED
  const dispatchedToday = await prisma.rental.findMany({
    where: {
      status: "DISPATCHED",
      startDate: { gte: now, lt: addDays(now, 1) },
    },
    include: {
      user: { select: { email: true } },
      item: { select: { name: true, brand: true } },
    },
  });

  for (const r of dispatchedToday) {
    try {
      await sendDeliveryConfirmationEmail(r.user.email, {
        rentalId: r.id,
        itemName: r.item.name,
        brand: r.item.brand,
        endDate: r.endDate.toLocaleDateString("de-DE"),
      });
      await prisma.rental.update({ where: { id: r.id }, data: { status: "ACTIVE" } });
      results.delivery++;
    } catch (e) {
      results.errors.push(`delivery ${r.id}: ${String(e)}`);
    }
  }

  // 2. Mid-rental check-in — rental started 3 days ago, status ACTIVE
  const activeDay3 = await prisma.rental.findMany({
    where: {
      status: "ACTIVE",
      startDate: { gte: addDays(now, -3), lt: addDays(now, -2) },
    },
    include: {
      user: { select: { email: true } },
      item: { select: { name: true, brand: true } },
    },
  });

  for (const r of activeDay3) {
    try {
      await sendMidRentalCheckInEmail(r.user.email, {
        rentalId: r.id,
        itemName: r.item.name,
        brand: r.item.brand,
        endDate: r.endDate.toLocaleDateString("de-DE"),
      });
      results.midCheckin++;
    } catch (e) {
      results.errors.push(`midCheckin ${r.id}: ${String(e)}`);
    }
  }

  // 3. Return reminder — endDate is 2 days from now, status ACTIVE
  const returnIn2Days = await prisma.rental.findMany({
    where: {
      status: "ACTIVE",
      endDate: { gte: in2Days, lt: in3Days },
    },
    include: {
      user: { select: { email: true } },
      item: { select: { name: true, brand: true } },
    },
  });

  for (const r of returnIn2Days) {
    try {
      await sendReturnReminderEmail(r.user.email, {
        rentalId: r.id,
        itemName: r.item.name,
        brand: r.item.brand,
        endDate: r.endDate.toLocaleDateString("de-DE"),
      });
      results.returnReminder++;
    } catch (e) {
      results.errors.push(`returnReminder ${r.id}: ${String(e)}`);
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
