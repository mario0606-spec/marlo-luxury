import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Booking Confirmed — Marlo" };

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export default async function ConfirmationPage({ params }: PageProps) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const { id } = await params;

  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      item: { select: { name: true, brand: true, images: true, slug: true, referenceNumber: true } },
    },
  });

  if (!rental) notFound();
  if (rental.userId !== userId) notFound();

  const days = Math.ceil(
    (rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const shipping = rental.shippingAddress as ShippingAddress | null;

  const shortRef = rental.id.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Success banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-stone-300 mb-6">
            <svg className="w-6 h-6 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-light tracking-wide text-stone-900 mb-3">Booking Confirmed</h1>
          <p className="text-stone-500 text-sm">
            A confirmation has been sent to your email. Payment is required within 24 hours.
          </p>
        </div>

        {/* Order card */}
        <div className="bg-white border border-stone-200 overflow-hidden mb-6">
          {/* Header */}
          <div className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-stone-400">Order Reference</span>
            <span className="font-mono text-sm text-stone-900 font-medium">MAR-{shortRef}</span>
          </div>

          {/* Item */}
          <div className="p-6 flex gap-4 border-b border-stone-100">
            {rental.item.images[0] && (
              <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden bg-stone-100">
                <Image
                  src={rental.item.images[0]}
                  alt={rental.item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">{rental.item.brand}</p>
              <p className="text-lg font-light text-stone-900">{rental.item.name}</p>
              {rental.item.referenceNumber && (
                <p className="text-xs text-stone-400">Ref. {rental.item.referenceNumber}</p>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
            <div className="p-6">
              <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-3">Rental Period</h3>
              <p className="text-sm text-stone-700">
                {rental.startDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-xs text-stone-400 my-1">to</p>
              <p className="text-sm text-stone-700">
                {rental.endDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-xs text-stone-400 mt-2">{days} day{days !== 1 ? "s" : ""}</p>
            </div>

            {shipping && (
              <div className="p-6">
                <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-3">Delivery Address</h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {shipping.fullName}<br />
                  {shipping.addressLine1}
                  {shipping.addressLine2 && <><br />{shipping.addressLine2}</>}<br />
                  {shipping.postalCode} {shipping.city}<br />
                  {shipping.country}
                </p>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="border-t border-stone-100 px-6 py-4 space-y-2">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Rental total ({days}d)</span>
              <span>{formatEur(rental.totalAmount - rental.depositAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-500">
              <span>Refundable deposit</span>
              <span>{formatEur(rental.depositAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-stone-900 pt-2 border-t border-stone-100">
              <span>Total due</span>
              <span>{formatEur(rental.totalAmount)}</span>
            </div>
          </div>

          {/* Status */}
          <div className="border-t border-stone-100 px-6 py-4 flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-stone-400">Status</span>
            <span className="text-xs tracking-widest uppercase bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1">
              Pending Payment
            </span>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-white border border-stone-200 p-6 mb-8">
          <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">Next Steps</h2>
          <ol className="space-y-3 text-sm text-stone-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 border border-stone-300 flex items-center justify-center text-xs text-stone-500">1</span>
              <span>Complete payment within 24 hours to secure your rental. You'll receive a payment link shortly.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 border border-stone-300 flex items-center justify-center text-xs text-stone-500">2</span>
              <span>Once payment is confirmed, your item will be prepared and dispatched for delivery.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 border border-stone-300 flex items-center justify-center text-xs text-stone-500">3</span>
              <span>Return the item by your end date. Your deposit will be refunded within 5 business days.</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/rentals" className="btn-primary flex-1 text-center">
            View My Rentals
          </Link>
          <Link href="/catalog" className="btn-outline flex-1 text-center">
            Continue Browsing
          </Link>
        </div>
      </main>
    </div>
  );
}
