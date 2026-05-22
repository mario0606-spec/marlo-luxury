/**
 * GET  /api/admin/rentals/[id]/labels  — fetch current DHL label data for a rental
 * POST /api/admin/rentals/[id]/labels  — regenerate DHL labels (idempotent, replaces existing)
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDhlShipment } from "@/lib/dhl";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const rental = await prisma.rental.findUnique({
    where: { id },
    select: {
      id: true,
      dhlOutboundTrackingNumber: true,
      dhlOutboundLabelUrl: true,
      dhlReturnTrackingNumber: true,
      dhlReturnLabelUrl: true,
      dhlShipmentCreatedAt: true,
    },
  });

  if (!rental) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(rental);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      user: { select: { email: true } },
      item: { select: { name: true, brand: true, retailPrice: true } },
    },
  });

  if (!rental) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const address = rental.shippingAddress as {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  } | null;

  if (!address) {
    return NextResponse.json({ error: "Rental has no shipping address" }, { status: 422 });
  }

  const dhlResult = await createDhlShipment(
    rental.id,
    {
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      email: rental.user.email,
    },
    `${rental.item.brand} ${rental.item.name}`,
    Math.round(rental.item.retailPrice / 100)
  );

  const updated = await prisma.rental.update({
    where: { id },
    data: {
      dhlOutboundTrackingNumber: dhlResult.outboundTrackingNumber,
      dhlOutboundLabelUrl: dhlResult.outboundLabelUrl,
      dhlReturnTrackingNumber: dhlResult.returnTrackingNumber,
      dhlReturnLabelUrl: dhlResult.returnLabelUrl,
      dhlShipmentCreatedAt: new Date(),
    },
    select: {
      dhlOutboundTrackingNumber: true,
      dhlOutboundLabelUrl: true,
      dhlReturnTrackingNumber: true,
      dhlReturnLabelUrl: true,
      dhlShipmentCreatedAt: true,
    },
  });

  return NextResponse.json(updated, { status: 201 });
}
