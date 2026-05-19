import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const kycSchema = z.object({
  fullName: z.string().min(3, "Full legal name required"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  documentType: z.enum(["PASSPORT", "NATIONAL_ID", "DRIVERS_LICENSE"], {
    errorMap: () => ({ message: "Valid document type required" }),
  }),
  documentNumber: z.string().min(4, "Document number required"),
});

// GET — return current user's KYC status
export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      kycStatus: true,
      kycSubmittedAt: true,
      kycFullName: true,
      kycDocumentType: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    kycStatus: user.kycStatus,
    kycSubmittedAt: user.kycSubmittedAt,
    kycFullName: user.kycFullName,
    kycDocumentType: user.kycDocumentType,
  });
}

// POST — submit KYC info (auto-verifies for MVP; admin can reject)
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycStatus: true },
  });

  if (existingUser?.kycStatus === "VERIFIED") {
    return NextResponse.json({ kycStatus: "VERIFIED" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = kycSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { fullName, dateOfBirth, documentType, documentNumber } = parsed.data;

  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) {
    return NextResponse.json({ error: "Invalid date of birth" }, { status: 422 });
  }

  const minAge = new Date();
  minAge.setFullYear(minAge.getFullYear() - 18);
  if (dob > minAge) {
    return NextResponse.json({ error: "Must be at least 18 years old" }, { status: 422 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "VERIFIED",
      kycSubmittedAt: new Date(),
      kycFullName: fullName,
      kycDateOfBirth: dob,
      kycDocumentType: documentType,
      kycDocumentNumber: documentNumber,
    },
    select: { kycStatus: true },
  });

  return NextResponse.json({ kycStatus: updated.kycStatus });
}
