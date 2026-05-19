import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { FavoriteButton } from "@/components/favorite-button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.item.findUnique({
    where: { slug },
    select: { name: true, brand: true, description: true },
  });
  if (!item) return { title: "Not Found" };
  return {
    title: `${item.name} — ${item.brand}`,
    description: item.description.slice(0, 160),
  };
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

const CATEGORY_LABELS: Record<string, string> = {
  WATCH: "Watch",
  JEWELRY: "Jewelry",
  BAG: "Bag",
  ACCESSORY: "Accessory",
  OTHER: "Other",
};

export default async function ItemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isSignedIn = !!userId;

  const [item, favorite] = await Promise.all([
    prisma.item.findUnique({
      where: { slug },
      include: {
        rentals: {
          where: { status: { in: ["CONFIRMED", "ACTIVE"] } },
          select: { startDate: true, endDate: true },
          orderBy: { startDate: "asc" },
        },
      },
    }),
    userId
      ? prisma.favorite.findFirst({ where: { userId, item: { slug } }, select: { id: true } })
      : null,
  ]);

  if (!item || item.category === "JEWELRY") notFound();

  const isFavorited = !!favorite;

  const bookedRanges = item.rentals.map((r) => ({
    start: r.startDate.toISOString().split("T")[0],
    end: r.endDate.toISOString().split("T")[0],
  }));

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs tracking-widest uppercase text-stone-400">
          <Link href="/catalog" className="hover:text-stone-600">
            Collection
          </Link>
          <span>/</span>
          <span className="text-stone-600">{CATEGORY_LABELS[item.category] ?? item.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Photo gallery */}
          <div className="space-y-3">
            {item.images.length > 0 ? (
              <>
                <div className="aspect-square bg-white border border-stone-200 overflow-hidden relative">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                {item.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {item.images.slice(1).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white border border-stone-200 overflow-hidden relative"
                      >
                        <Image
                          src={img}
                          alt={`${item.name} ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-white border border-stone-200 flex items-center justify-center">
                <span className="text-xs tracking-widest uppercase text-stone-300">
                  No image
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs tracking-widest uppercase text-stone-400">
                {CATEGORY_LABELS[item.category]}
              </span>
              {!item.available && (
                <span className="text-xs tracking-widest uppercase text-red-400 border border-red-200 px-2 py-0.5">
                  Unavailable
                </span>
              )}
            </div>

            <p className="text-sm tracking-widest uppercase text-stone-500 mb-2">
              {item.brand}
            </p>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-light tracking-tight text-stone-900">
                {item.name}
              </h1>
              {isSignedIn && (
                <FavoriteButton itemId={item.id} initialFavorited={isFavorited} />
              )}
            </div>
            {item.referenceNumber && (
              <p className="text-xs text-stone-400 mb-6">Ref. {item.referenceNumber}</p>
            )}

            <p className="text-stone-600 leading-relaxed mb-8">{item.description}</p>

            {/* Pricing */}
            <div className="border border-stone-200 bg-white p-6 mb-8">
              <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">
                Rental Pricing
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-stone-600">Daily rental</span>
                  <span className="text-lg font-light text-stone-900">
                    {formatEur(item.dailyRate)}
                  </span>
                </div>
                {item.weeklyRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">Weekly rental</span>
                    <div className="text-right">
                      <span className="text-lg font-light text-stone-900">
                        {formatEur(item.weeklyRate)}
                      </span>
                      <span className="ml-2 text-xs text-stone-400">
                        ({formatEur(Math.round(item.weeklyRate / 7))}/day)
                      </span>
                    </div>
                  </div>
                )}
                {item.monthlyRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">Monthly subscription</span>
                    <div className="text-right">
                      <span className="text-lg font-light text-stone-900">
                        {formatEur(item.monthlyRate)}
                      </span>
                      <span className="ml-2 text-xs text-stone-400">/ month</span>
                    </div>
                  </div>
                )}
                <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                  <span className="text-sm text-stone-500">Refundable deposit</span>
                  <span className="text-sm text-stone-600">{formatEur(item.depositAmount)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {item.available ? (
                  isSignedIn ? (
                    <Link href={`/book/${item.slug}`} className="btn-primary w-full">
                      Book This Piece
                    </Link>
                  ) : (
                    <>
                      <Link href={`/auth/signin?callbackUrl=/book/${item.slug}`} className="btn-primary w-full">
                        Book This Piece
                      </Link>
                      <p className="text-center text-xs text-stone-400">
                        Sign in or create an account to book
                      </p>
                    </>
                  )
                ) : (
                  <button disabled className="btn-primary w-full opacity-40 cursor-not-allowed">
                    Currently Unavailable
                  </button>
                )}
              </div>
            </div>

            {/* Specs */}
            {(item.model || item.referenceNumber || item.retailPrice) && (
              <div className="border border-stone-200 bg-white p-6 mb-8">
                <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">
                  Specifications
                </h2>
                <dl className="space-y-2 text-sm">
                  {item.brand && (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Brand</dt>
                      <dd className="text-stone-900">{item.brand}</dd>
                    </div>
                  )}
                  {item.model && (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Model</dt>
                      <dd className="text-stone-900">{item.model}</dd>
                    </div>
                  )}
                  {item.referenceNumber && (
                    <div className="flex justify-between">
                      <dt className="text-stone-500">Reference</dt>
                      <dd className="text-stone-900">{item.referenceNumber}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Retail value</dt>
                    <dd className="text-stone-900">{formatEur(item.retailPrice)}</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Booked dates */}
            {bookedRanges.length > 0 && (
              <div className="border border-stone-200 bg-white p-6">
                <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">
                  Booked Dates
                </h2>
                <ul className="space-y-1 text-sm text-stone-600">
                  {bookedRanges.map((r, i) => (
                    <li key={i}>
                      {r.start} — {r.end}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs tracking-wider text-stone-400 uppercase">
          © {new Date().getFullYear()} Marlo Luxury Rentals
        </div>
      </footer>
    </div>
  );
}
