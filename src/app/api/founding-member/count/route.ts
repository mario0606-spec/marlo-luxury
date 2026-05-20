import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/founding-member";

export const revalidate = 0;

export async function GET() {
  try {
    const count = await prisma.foundingMember.count();
    return NextResponse.json({
      count,
      limit: FOUNDING_MEMBER_LIMIT,
      remaining: Math.max(0, FOUNDING_MEMBER_LIMIT - count),
      soldOut: count >= FOUNDING_MEMBER_LIMIT,
    });
  } catch (err) {
    console.error("[founding-member/count]", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
