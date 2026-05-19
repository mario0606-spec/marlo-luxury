import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.favorite.groupBy({
    by: ["itemId"],
    _count: { itemId: true },
    orderBy: { _count: { itemId: "desc" } },
    take: 50,
  });

  const itemIds = favorites.map((f) => f.itemId);
  const items = await prisma.item.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, name: true, brand: true, slug: true, available: true, images: true },
  });

  const itemMap = new Map(items.map((i) => [i.id, i]));

  const result = favorites.map((f) => ({
    item: itemMap.get(f.itemId),
    favoriteCount: f._count.itemId,
  })).filter((r) => r.item);

  return NextResponse.json(result);
}
