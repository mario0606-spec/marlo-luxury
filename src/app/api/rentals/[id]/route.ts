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
    include: {
      item: { select: { name: true, brand: true, images: true, slug: true, referenceNumber: true } },
      user: { select: { email: true, name: true } },
    },
  });

  if (!rental) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only the renting user or an admin can view
  if (rental.userId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(rental);
}
