import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ itemId: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await params;

  const item = await prisma.item.findUnique({ where: { id: itemId }, select: { id: true } });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const favorite = await prisma.favorite.upsert({
    where: { userId_itemId: { userId, itemId } },
    create: { userId, itemId },
    update: {},
  });

  return NextResponse.json(favorite, { status: 201 });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await params;

  await prisma.favorite.deleteMany({ where: { userId, itemId } });

  return NextResponse.json({ ok: true });
}
