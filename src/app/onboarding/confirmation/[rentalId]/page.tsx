import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Confirmed — Marlo",
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
        {/* §4.3 Confirmation mark — circle with centered diamond */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="27" stroke="#292524" strokeWidth="1.5" />
              <rect
                x="28"
                y="20"
                width="8"
                height="8"
                transform="rotate(45 28 20)"
                fill="#292524"
              />
            </svg>
          </div>
          <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">
            Confirmed
          </p>

          {/* §4.4 Headline */}
          <h1 className="text-2xl font-light text-stone-900 mb-2">
            Your first watch is confirmed.
          </h1>

          {/* §4.4 Subtext with brand/name interpolation */}
          <p className="text-sm font-light text-stone-600 mt-2 leading-relaxed max-w-md mx-auto">
            We are preparing your {rental.item.brand} {rental.item.name} and
            will notify you once it&rsquo;s on its way.
          </p>
        </div>

        {/* Watch image card */}
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

        {/* §4.5 Dispatch timeline */}
        <div className="bg-white border border-stone-200 p-8 mb-8">
          <p className="text-xs tracking-widest uppercase text-stone-500 mb-6">
            What happens next
          </p>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 flex-shrink-0 stroke-stone-400" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <span className="text-sm font-light text-stone-700">Inspected and prepared for you</span>
              <span className="text-xs text-stone-400 ml-auto">Within 24 hours</span>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 flex-shrink-0 stroke-stone-400" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="1" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              <span className="text-sm font-light text-stone-700">Dispatched by express courier</span>
              <span className="text-xs text-stone-400 ml-auto">1–2 business days</span>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 flex-shrink-0 stroke-stone-400" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18" />
                <path d="M16 2v4M8 2v4" />
              </svg>
              <span className="text-sm font-light text-stone-700">Your rental begins on arrival</span>
              <span className="text-xs text-stone-400 ml-auto">Enjoy</span>
            </div>
          </div>
        </div>

        {/* §4.6 CTAs */}
        <Link
          href="/dashboard"
          className="btn-primary w-full py-4 text-center block"
        >
          Go to my dashboard →
        </Link>
        <Link
          href="/watches"
          className="text-sm text-stone-500 underline text-center mt-3 block"
        >
          Explore the full collection
        </Link>
      </main>
    </div>
  );
}
