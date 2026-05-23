import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Your watch is on its way — Marlo",
};

interface Props {
  params: Promise<{ rentalId: string }>;
}

export default async function ConfirmationPage({ params }: Props) {
  const { rentalId } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: {
      item: {
        select: { name: true, brand: true, images: true, slug: true },
      },
    },
  });

  if (!rental || rental.userId !== userId) notFound();

  const shipping = (rental.shippingAddress as {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }) ?? {};

  const estimatedDelivery = new Date(rental.startDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">
            Marlo
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center border border-stone-900">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">
            Confirmed
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-4">
            Your watch is on its way.
          </h1>
          <p className="text-stone-500 leading-relaxed max-w-md mx-auto">
            We&rsquo;re preparing your piece with care. You&rsquo;ll receive an email when
            it ships.
          </p>
        </div>

        <div className="bg-white border border-stone-200 mb-8">
          {rental.item.images[0] && (
            <div className="flex justify-center py-8 bg-stone-50">
              <div className="relative w-[160px] h-[160px]">
                <Image
                  src={rental.item.images[0]}
                  alt={rental.item.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          <div className="p-8 text-center border-t border-stone-100">
            <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">
              Your selection
            </p>
            <p className="text-2xl font-light text-stone-900 mb-1">{rental.item.brand}</p>
            <p className="text-stone-600">{rental.item.name}</p>
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">
                Estimated delivery
              </p>
              <p className="text-stone-900">{fmt(estimatedDelivery)}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">
                Return by
              </p>
              <p className="text-stone-900">{fmt(rental.endDate)}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">
                Shipping to
              </p>
              <p className="text-stone-900">{shipping.fullName}</p>
              <p className="text-stone-600">
                {shipping.addressLine1}
                {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}
              </p>
              <p className="text-stone-600">
                {shipping.postalCode} {shipping.city}, {shipping.country}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/rentals"
            className="py-4 bg-stone-900 text-white text-sm tracking-widest uppercase text-center hover:bg-stone-800 transition-colors"
          >
            View my rentals
          </Link>
          <Link
            href="/dashboard"
            className="py-4 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase text-center hover:border-stone-500 transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
