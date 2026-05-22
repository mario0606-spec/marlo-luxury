import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ rentalId: string }>;
}

export default async function OnboardingConfirmationPage({ params }: Props) {
  const { rentalId } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId, userId },
    include: { item: true },
  });

  if (!rental) redirect("/dashboard");

  const returnDate = rental.endDate.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">Marlo</Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        {/* Check mark */}
        <div className="w-16 h-16 mx-auto mb-10 border border-stone-900 flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">Your first watch</p>
        <h1 className="text-4xl font-light tracking-wide mb-3">
          It's on its way.
        </h1>
        <p className="text-stone-500 mb-12 max-w-sm mx-auto leading-relaxed">
          We're preparing your {rental.item.brand} {rental.item.name} and will send you a tracking number once it's dispatched.
        </p>

        {/* Watch summary card */}
        <div className="bg-white border border-stone-200 p-8 text-left mb-12 max-w-sm mx-auto">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Your Selection</p>
          <p className="text-xl font-light mb-1">{rental.item.brand}</p>
          <p className="text-stone-600 mb-6">{rental.item.name}</p>

          <div className="space-y-3 text-sm text-stone-600 border-t border-stone-100 pt-6">
            <div className="flex justify-between">
              <span className="text-stone-400">Return by</span>
              <span>{returnDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Status</span>
              <span className="text-green-700">Confirmed</span>
            </div>
            {rental.shippingAddress && (() => {
              const addr = rental.shippingAddress as { city?: string; country?: string };
              return addr.city ? (
                <div className="flex justify-between">
                  <span className="text-stone-400">Delivering to</span>
                  <span>{addr.city}, {addr.country}</span>
                </div>
              ) : null;
            })()}
          </div>
        </div>

        <p className="text-sm text-stone-500 mb-10 leading-relaxed max-w-sm mx-auto">
          A confirmation has been sent to your email. Questions? Reply to the email or use our live chat — we're here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/rentals"
            className="px-8 py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            View My Rentals
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
