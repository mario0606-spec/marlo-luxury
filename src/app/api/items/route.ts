import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ItemCategory, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const category = searchParams.get("category");
  const price = searchParams.get("price");
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = 12;

  const where: Prisma.ItemWhereInput = {};

  if (category && Object.values(ItemCategory).includes(category as ItemCategory)) {
    where.category = category as ItemCategory;
  }

  if (price) {
    const [minStr, maxStr] = price.split("-");
    const min = parseInt(minStr, 10);
    const max = maxStr ? parseInt(maxStr, 10) : undefined;
    where.dailyRate = {
      gte: isNaN(min) ? undefined : min,
      lte: max !== undefined && !isNaN(max) ? max : undefined,
    };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        name: true,
        brand: true,
        category: true,
        dailyRate: true,
        weeklyRate: true,
        images: true,
        available: true,
        featured: true,
      },
    }),
    prisma.item.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
