import { NextRequest, NextResponse } from "next/server";
import { getBundleBySlug } from "@/lib/bundles";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { bundleSlug, customerName, customerEmail, startDate } = body;

  if (!bundleSlug || !customerName || !customerEmail || !startDate) {
    return NextResponse.json(
      { error: "Alle Felder sind erforderlich." },
      { status: 400 }
    );
  }

  const bundle = getBundleBySlug(bundleSlug);
  if (!bundle) {
    return NextResponse.json(
      { error: "Bundle nicht gefunden." },
      { status: 404 }
    );
  }

  const id = crypto.randomUUID();

  // swap-when-funded: Stripe payments — integrate Stripe Checkout for real charges
  // For now: return success with booking ID (no payment collected).
  console.log(
    `[Booking] ${id} — ${bundle.displayName} for ${customerName} <${customerEmail}> starting ${startDate}`
  );

  return NextResponse.json({ id, status: "confirmed" }, { status: 201 });
}
