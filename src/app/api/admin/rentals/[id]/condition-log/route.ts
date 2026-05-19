import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

const bodySchema = z.object({
  phase: z.enum(["DISPATCH", "RETURN"]),
  status: z.enum(["PRISTINE", "MINOR_WEAR", "DAMAGE", "MISSING_ITEM"]),
  notes: z.string().max(2000).optional(),
  photos: z.array(z.string()).min(2, "At least 2 photos required").max(10),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const logs = await prisma.conditionLog.findMany({
    where: { rentalId: id },
    orderBy: { phase: "asc" },
  });
  return NextResponse.json(logs);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const rental = await prisma.rental.findUnique({ where: { id } });
  if (!rental) return NextResponse.json({ error: "Rental not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { phase, status, notes, photos } = parsed.data;

  const log = await prisma.conditionLog.upsert({
    where: { rentalId_phase: { rentalId: id, phase } },
    create: { rentalId: id, phase, status, notes: notes ?? null, photos },
    update: { status, notes: notes ?? null, photos },
  });

  return NextResponse.json(log);
}
