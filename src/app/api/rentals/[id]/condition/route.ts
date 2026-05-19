import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const rental = await prisma.rental.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!rental) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (rental.userId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await prisma.conditionLog.findMany({
    where: { rentalId: id },
    orderBy: { capturedAt: "asc" },
    select: {
      id: true,
      type: true,
      photos: true,
      notes: true,
      assessment: true,
      capturedAt: true,
    },
  });

  // Customers only see dispatch photos (not return assessment details)
  if (userRole !== "ADMIN") {
    return NextResponse.json(
      logs
        .filter((l: { type: string }) => l.type === "DISPATCH")
        .map((l: { id: string; type: string; photos: string[]; notes: string | null; assessment: string | null; capturedAt: Date }) => ({ id: l.id, type: l.type, photos: l.photos, capturedAt: l.capturedAt }))
    );
  }

  return NextResponse.json(logs);
}
