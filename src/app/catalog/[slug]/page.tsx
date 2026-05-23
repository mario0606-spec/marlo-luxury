import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NavServer as Nav } from "@/components/nav-server";
import { FavoriteButton } from "@/components/favorite-button";
import { ReviewsSection } from "@/components/reviews-section";
import { WatchGallery } from "@/components/watch-gallery";
import { PricingAvailability } from "@/components/pricing-availability";
import { TrustSignals } from "@/components/trust-signals";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { RelatedWatches, type RelatedWatch } from "@/components/related-watches";
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

const HERO_SENTINEL_ID = "watch-hero-cta-sentinel";

export default async function ItemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isSignedIn = !!userId;

  const [item, favorite, reviews] = await Promise.all([
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
    prisma.review.findMany({
      where: { item: { slug }, status: "APPROVED" },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!item || item.category === "JEWELRY") notFound();

  // Related watches: 2-tier query — same brand first, fall back to same category.
  const sameBrand = await prisma.item.findMany({
    where: {
      id: { not: item.id },
      category: item.category,
      brand: item.brand,
      available: true,
    },
    select: { id: true, slug: true, name: true, brand: true, dailyRate: true, images: true },
    take: 6,
    orderBy: { featured: "desc" },
  });
  let related = sameBrand;
  if (related.length < 6) {
    const fillers = await prisma.item.findMany({
      where: {
        id: { not: item.id, notIn: related.map((r) => r.id) },
        category: item.category,
        available: true,
      },
      select: { id: true, slug: true, name: true, brand: true, dailyRate: true, images: true },
      take: 6 - related.length,
      orderBy: { featured: "desc" },
    });
    related = [...related, ...fillers];
  }
  const relatedWatches: RelatedWatch[] = related.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    dailyRate: r.dailyRate,
    images: r.images,
  }));

  const isFavorited = !!favorite;

  const approvedReviews = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    body: r.body,
    occasion: r.occasion,
    verifiedRental: r.verifiedRental,
    reviewerName: r.user.name ?? "Member",
    createdAt: r.createdAt.toISOString(),
  }));

  const avgRating =
    approvedReviews.length > 0
      ? Math.round((approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length) * 10) / 10
      : null;

  const bookedRanges = item.rentals.map((r) => ({
    start: r.startDate.toISOString().split("T")[0],
    end: r.endDate.toISOString().split("T")[0],
  }));

  const bookHref = isSignedIn
    ? `/book/${item.slug}`
    : `/auth/signin?callbackUrl=/book/${item.slug}`;

  const itemCondition = (item as { condition?: string | null }).condition ?? null;

  return (
    <div className="min-h-screen bg-stone-50 pb-24 sm:pb-0">
      <Nav />

      <main id="main-content" className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs tracking-widest uppercase text-stone-600">
          <Link href="/catalog" className="hover:text-stone-900">
            Collection
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-900">{CATEGORY_LABELS[item.category] ?? item.category}</span>
        </nav>

        {/* Hero grid: sticky gallery + buy box */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Gallery — sticky on desktop */}
          <div className="lg:sticky lg:top-24">
            <WatchGallery images={item.images} alt={item.name} />
          </div>

          {/* Buy box */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs tracking-widest uppercase text-stone-500">
                {CATEGORY_LABELS[item.category]}
              </span>
              {!item.available && (
                <span className="text-[10px] tracking-widest uppercase text-red-600 border border-red-200 px-2 py-0.5">
                  Unavailable
                </span>
              )}
            </div>

            <p className="text-sm tracking-widest uppercase text-stone-500 mb-2">{item.brand}</p>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-stone-900 leading-tight">
                {item.name}
              </h1>
              {isSignedIn && (
                <FavoriteButton itemId={item.id} initialFavorited={isFavorited} />
              )}
            </div>
            {item.referenceNumber && (
              <p className="text-xs text-stone-500 mb-3">Ref. {item.referenceNumber}</p>
            )}
            {avgRating !== null && approvedReviews.length >= 3 ? (
              <a
                href="#reviews"
                className="inline-flex items-center gap-2 text-sm text-stone-700 mb-6 hover:text-stone-900"
              >
                <span className="text-amber-500" aria-hidden="true">
                  {"★".repeat(Math.round(avgRating))}
                  {"☆".repeat(5 - Math.round(avgRating))}
                </span>
                <span className="font-light">{avgRating.toFixed(1)}</span>
                <span className="text-stone-500">· {approvedReviews.length} rentals</span>
              </a>
            ) : (
              <div className="mb-4" />
            )}

            <p className="text-stone-700 leading-relaxed mb-8">{item.description}</p>

            {/* CTA */}
            <div id={HERO_SENTINEL_ID} className="mb-6">
              {item.available ? (
                <Link href={bookHref} className="btn-primary w-full text-center block">
                  Book This Piece
                </Link>
              ) : (
                <button disabled className="btn-primary w-full opacity-40 cursor-not-allowed">
                  Currently Unavailable
                </button>
              )}
              {!isSignedIn && item.available && (
                <p className="text-center text-xs text-stone-500 mt-2">
                  Sign in or create an account to book
                </p>
              )}
            </div>

            {/* Pricing + Availability */}
            <div className="mb-6">
              <PricingAvailability
                dailyRate={item.dailyRate}
                weeklyRate={item.weeklyRate}
                monthlyRate={item.monthlyRate}
                depositAmount={item.depositAmount}
                bookedRanges={bookedRanges}
                available={item.available}
              />
            </div>

            {/* Trust signals */}
            <div className="mb-6">
              <TrustSignals condition={itemCondition} />
            </div>

            {/* Specs */}
            {(item.model || item.referenceNumber || item.retailPrice) && (
              <div className="border border-stone-200 bg-white p-6">
                <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">
                  Specifications
                </h2>
                <dl className="space-y-2 text-sm">
                  <Spec label="Brand" value={item.brand} />
                  {item.model && <Spec label="Model" value={item.model} />}
                  {item.referenceNumber && (
                    <Spec label="Reference" value={item.referenceNumber} />
                  )}
                  <Spec label="Retail value" value={formatEur(item.retailPrice)} />
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div id="reviews" className="mt-16">
          <ReviewsSection
            reviews={approvedReviews}
            averageRating={avgRating}
            totalReviews={approvedReviews.length}
            itemSlug={item.slug}
            reviewCta={
              isSignedIn ? { href: `/dashboard/rentals`, label: "Write a review →" } : null
            }
          />
        </div>

        {/* Related */}
        {relatedWatches.length > 0 && (
          <div className="mt-16">
            <RelatedWatches watches={relatedWatches} />
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs tracking-wider text-stone-500 uppercase">
          © {new Date().getFullYear()} Marlo Luxury Rentals
        </div>
      </footer>

      <StickyMobileCTA
        itemSlug={item.slug}
        dailyRate={item.dailyRate}
        available={item.available}
        isSignedIn={isSignedIn}
        sentinelId={HERO_SENTINEL_ID}
      />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-stone-900">{value}</dd>
    </div>
  );
}
