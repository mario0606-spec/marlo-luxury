import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { ItemCategory } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.nativeEnum(ItemCategory).optional(),
  brand: z.string().min(1).optional(),
  model: z.string().optional(),
  referenceNumber: z.string().optional(),
  retailPrice: z.number().int().positive().optional(),
  dailyRate: z.number().int().positive().optional(),
  weeklyRate: z.number().int().positive().optional().nullable(),
  monthlyRate: z.number().int().positive().optional().nullable(),
  depositAmount: z.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).min(1).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(
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

  const item = await prisma.item.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(item);
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

  await prisma.item.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
