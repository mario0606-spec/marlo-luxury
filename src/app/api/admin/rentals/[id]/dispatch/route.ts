import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDispatchConditionEmail } from "@/lib/email";
import { createDhlShipment } from "@/lib/dhl";

const dispatchSchema = z.object({
  photos: z.array(z.string().min(10)).min(2, "At least 2 photos required"),
  notes: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId || userRole !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = dispatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const { photos, notes } = parsed.data;

  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      item: { select: { name: true, brand: true, retailPrice: true } },
      conditionLogs: { where: { type: "DISPATCH" } },
    },
  });

  if (!rental) {
    return NextResponse.json({ error: "Rental not found" }, { status: 404 });
  }

  if (rental.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: `Cannot dispatch rental in status ${rental.status}. Must be CONFIRMED.` },
      { status: 409 }
    );
  }

  if (rental.conditionLogs.length > 0) {
    return NextResponse.json({ error: "Dispatch condition log already exists" }, { status: 409 });
  }

  // Generate DHL Express outbound + return labels
  const address = rental.shippingAddress as {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  } | null;

  let dhlResult: {
    outboundTrackingNumber: string;
    outboundLabelUrl: string;
    returnTrackingNumber: string;
    returnLabelUrl: string;
  } | null = null;
  let dhlError: string | null = null;

  if (address && process.env.DHL_API_KEY && process.env.DHL_API_SECRET) {
    try {
      dhlResult = await createDhlShipment(
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
        Math.round(rental.item.retailPrice / 100) // retailPrice is in cents, DHL wants EUR
      );
    } catch (err) {
      // DHL failure is non-fatal: log it, flag in response, but still dispatch
      dhlError = String(err);
      console.error("[DHL] Label generation failed:", dhlError);
    }
  } else if (!process.env.DHL_API_KEY) {
    dhlError = "DHL credentials not configured (DHL_API_KEY missing)";
    console.warn("[DHL]", dhlError);
  }

  const [conditionLog] = await prisma.$transaction([
    prisma.conditionLog.create({
      data: {
        rentalId: id,
        type: "DISPATCH",
        photos,
        notes,
        capturedBy: userId,
      },
    }),
    prisma.rental.update({
      where: { id },
      data: {
        status: "DISPATCHED",
        ...(dhlResult
          ? {
              dhlOutboundTrackingNumber: dhlResult.outboundTrackingNumber,
              dhlOutboundLabelUrl: dhlResult.outboundLabelUrl,
              dhlReturnTrackingNumber: dhlResult.returnTrackingNumber,
              dhlReturnLabelUrl: dhlResult.returnLabelUrl,
              dhlShipmentCreatedAt: new Date(),
            }
          : {}),
      },
    }),
  ]);

  // Fire-and-forget dispatch email with first photo
  sendDispatchConditionEmail(rental.user.email, {
    rentalId: rental.id,
    itemName: rental.item.name,
    brand: rental.item.brand,
    dispatchPhoto: photos[0],
  }).catch((err) => console.error("Dispatch condition email failed:", err));

  return NextResponse.json(
    {
      conditionLogId: conditionLog.id,
      status: "DISPATCHED",
      dhl: dhlResult
        ? {
            outboundTrackingNumber: dhlResult.outboundTrackingNumber,
            returnTrackingNumber: dhlResult.returnTrackingNumber,
            outboundLabelUrl: dhlResult.outboundLabelUrl,
            returnLabelUrl: dhlResult.returnLabelUrl,
          }
        : null,
      dhlError: dhlError ?? undefined,
    },
    { status: 201 }
  );
}
