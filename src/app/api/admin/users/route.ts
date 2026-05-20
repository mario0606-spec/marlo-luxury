import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/users — list users with their onboarding preferences
export async function GET() {
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      onboardingCompleted: true,
      createdAt: true,
      subscriptions: {
        select: { id: true, plan: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      preferences: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}
