import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

const authenticitySchema = z.object({
  itemId: z.string().min(1),
  serialNumber: z.string().min(1),
  watchmaker: z.string().min(1),
  inspectionVideoUrl: z.string().url().optional().nullable(),
  nfcUid: z.string().optional().nullable(),
  conditionNotes: z.string().optional().nullable(),
  authenticatedBy: z.string().min(1),
  status: z.enum(["PENDING", "VERIFIED", "REVOKED"]).default("VERIFIED"),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.watchAuthenticity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      item: {
        select: { id: true, name: true, brand: true, slug: true, images: true },
      },
    },
  });

  return NextResponse.json({ records });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = authenticitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const item = await prisma.item.findUnique({ where: { id: parsed.data.itemId } });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const existing = await prisma.watchAuthenticity.findUnique({
    where: { itemId: parsed.data.itemId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Authenticity record already exists for this item. Use PUT to update." },
      { status: 409 }
    );
  }

  const serialExists = await prisma.watchAuthenticity.findUnique({
    where: { serialNumber: parsed.data.serialNumber },
  });
  if (serialExists) {
    return NextResponse.json({ error: "Serial number already in use" }, { status: 409 });
  }

  const record = await prisma.watchAuthenticity.create({
    data: parsed.data,
    include: {
      item: {
        select: { id: true, name: true, brand: true, slug: true },
      },
    },
  });

  return NextResponse.json(record, { status: 201 });
}
