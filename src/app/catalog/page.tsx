import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ItemCategory, Prisma, RentalStatus } from "@prisma/client";
import { NavServer as Nav } from "@/components/nav-server";
import { CatalogFilters } from "@/components/catalog-filters";
import { CatalogGrid } from "@/components/catalog-grid";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collection" };

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    price?: string;
    q?: string;
    page?: string;
    brand?: string;
    available?: string;
    sort?: string;
  }>;
}

async function CatalogContent({
  category,
  price,
  q,
  brand,
  available,
  sort,
}: {
  category: string;
  price: string;
  q: string;
  brand: string;
  available: string;
  sort: string;
}) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const where: Prisma.ItemWhereInput = {
    category: { not: ItemCategory.JEWELRY },
  };

  if (category && Object.values(ItemCategory).includes(category as ItemCategory) && category !== "JEWELRY") {
    where.category = category as ItemCategory;
  }

  if (brand) {
    const brands = brand.split(",").map((b) => b.trim()).filter(Boolean);
    if (brands.length > 0) {
      where.brand = { in: brands };
    }
  }

  if (price) {
    const [minStr, maxStr] = price.split("-");
    const min = parseInt(minStr, 10);
    const max = maxStr ? parseInt(maxStr, 10) : undefined;
    where.dailyRate = {
      gte: isNaN(min) ? undefined : min,
      lte: max !== undefined && !isNaN(max) ? max : undefined,
    };
  }

  if (available === "1") {
    where.available = true;
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ItemOrderByWithRelationInput[] = [
    { featured: "desc" },
    { createdAt: "desc" },
  ];
  if (sort === "price_asc") orderBy = [{ dailyRate: "asc" }];
  else if (sort === "price_desc") orderBy = [{ dailyRate: "desc" }];
  else if (sort === "newest") orderBy = [{ createdAt: "desc" }];

  const [items, total, userFavorites, allBrands] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        name: true,
        brand: true,
        category: true,
        dailyRate: true,
        weeklyRate: true,
        images: true,
        available: true,
        featured: true,
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
        rentals: {
          where: { status: { in: [RentalStatus.CONFIRMED, RentalStatus.ACTIVE] } },
          select: { endDate: true },
          orderBy: { endDate: "desc" },
          take: 1,
        },
      },
    }),
    prisma.item.count({ where }),
    userId
      ? prisma.favorite.findMany({ where: { userId }, select: { itemId: true } })
      : Promise.resolve([]),
    prisma.item
      .findMany({
        where: { category: { not: ItemCategory.JEWELRY } },
        select: { brand: true },
        distinct: ["brand"],
        orderBy: { brand: "asc" },
      })
      .then((rows) => rows.map((r) => r.brand)),
  ]);

  const favoritedIds = new Set(userFavorites.map((f) => f.itemId));

  const mapped = items.map((item) => {
    const approvedReviews = item.reviews ?? [];
    const avgRating =
      approvedReviews.length >= 3
        ? Math.round((approvedReviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / approvedReviews.length) * 10) / 10
        : null;
    return {
      id: item.id,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      category: item.category,
      dailyRate: item.dailyRate,
      weeklyRate: item.weeklyRate,
      images: item.images,
      available: item.available,
      featured: item.featured,
      availableFrom: item.rentals[0]?.endDate?.toISOString() ?? null,
      isFavorited: userId ? favoritedIds.has(item.id) : undefined,
      averageRating: avgRating,
      reviewCount: approvedReviews.length >= 3 ? approvedReviews.length : undefined,
    };
  });

  const showAvailableBadge = available === "1";

  return (
    <>
      <div className="mb-8 p-6 bg-white border border-stone-200">
        <Suspense>
          <CatalogFilters
            category={category}
            priceRange={price}
            search={q}
            brand={brand}
            available={available}
            sort={sort}
            brands={allBrands}
          />
        </Suspense>
      </div>

      <Suspense>
        <CatalogGrid
          initialItems={mapped}
          total={total}
          showAvailableBadge={showAvailableBadge}
        />
      </Suspense>
    </>
  );
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category ?? "";
  const price = sp.price ?? "";
  const q = sp.q ?? "";
  const brand = sp.brand ?? "";
  const available = sp.available ?? "";
  const sort = sp.sort ?? "";

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main id="main-content" className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <p className="text-xs tracking-widest uppercase text-stone-600 mb-3">
            Marlo Collection
          </p>
          <h1 className="text-4xl font-light tracking-tight text-stone-900">
            Luxury Rentals
          </h1>
        </header>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-stone-200 animate-pulse">
                  <div className="aspect-square bg-stone-100" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                    <div className="h-4 bg-stone-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <CatalogContent
            category={category}
            price={price}
            q={q}
            brand={brand}
            available={available}
            sort={sort}
          />
        </Suspense>
      </main>

      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs tracking-wider text-stone-600 uppercase">
          © {new Date().getFullYear()} Marlo Luxury Rentals
        </div>
      </footer>
    </div>
  );
}
