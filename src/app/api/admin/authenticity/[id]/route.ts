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

const updateSchema = z.object({
  serialNumber: z.string().min(1).optional(),
  watchmaker: z.string().min(1).optional(),
  inspectionVideoUrl: z.string().url().optional().nullable(),
  nfcUid: z.string().optional().nullable(),
  conditionNotes: z.string().optional().nullable(),
  authenticatedBy: z.string().min(1).optional(),
  status: z.enum(["PENDING", "VERIFIED", "REVOKED"]).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const record = await prisma.watchAuthenticity.findUnique({
    where: { id },
    include: {
      item: {
        select: { id: true, name: true, brand: true, slug: true, images: true, referenceNumber: true },
      },
    },
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.watchAuthenticity.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.serialNumber && parsed.data.serialNumber !== existing.serialNumber) {
    const dup = await prisma.watchAuthenticity.findUnique({
      where: { serialNumber: parsed.data.serialNumber },
    });
    if (dup) {
      return NextResponse.json({ error: "Serial number already in use" }, { status: 409 });
    }
  }

  const record = await prisma.watchAuthenticity.update({
    where: { id },
    data: parsed.data,
    include: {
      item: {
        select: { id: true, name: true, brand: true, slug: true },
      },
    },
  });

  return NextResponse.json(record);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.watchAuthenticity.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.watchAuthenticity.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
