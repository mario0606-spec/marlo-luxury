import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ serial: string }> }
) {
  const { serial } = await params;
  const decoded = decodeURIComponent(serial);

  const record = await prisma.watchAuthenticity.findUnique({
    where: { serialNumber: decoded },
    include: {
      item: {
        select: {
          name: true,
          brand: true,
          model: true,
          referenceNumber: true,
          images: true,
          slug: true,
          condition: true,
        },
      },
    },
  });

  if (!record || record.status === "REVOKED") {
    return NextResponse.json(
      { verified: false, error: "No authenticity record found for this serial number." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    verified: record.status === "VERIFIED",
    status: record.status,
    serialNumber: record.serialNumber,
    watchmaker: record.watchmaker,
    authenticatedAt: record.authenticatedAt.toISOString(),
    authenticatedBy: record.authenticatedBy,
    inspectionVideoUrl: record.inspectionVideoUrl,
    conditionNotes: record.conditionNotes,
    item: {
      name: record.item.name,
      brand: record.item.brand,
      model: record.item.model,
      referenceNumber: record.item.referenceNumber,
      image: record.item.images[0] ?? null,
      slug: record.item.slug,
      condition: record.item.condition,
    },
  });
}
