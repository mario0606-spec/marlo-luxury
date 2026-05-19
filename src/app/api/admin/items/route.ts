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

const itemSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  category: z.nativeEnum(ItemCategory),
  brand: z.string().min(1),
  model: z.string().optional(),
  referenceNumber: z.string().optional(),
  retailPrice: z.number().int().positive(),
  dailyRate: z.number().int().positive(),
  weeklyRate: z.number().int().positive().optional(),
  monthlyRate: z.number().int().positive().optional(),
  depositAmount: z.number().int().nonnegative(),
  images: z.array(z.string().url()).min(1),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  purchasable: z.boolean().default(false),
  purchasePrice: z.number().int().positive().optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      category: true,
      dailyRate: true,
      available: true,
      featured: true,
      images: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = itemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const slugExists = await prisma.item.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (slugExists) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const item = await prisma.item.create({ data: parsed.data });
  return NextResponse.json(item, { status: 201 });
}
