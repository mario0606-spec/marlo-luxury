import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ItemCategory, Prisma } from "@prisma/client";
import { Nav } from "@/components/nav";
import { ItemCard } from "@/components/item-card";
import { CatalogFilters } from "@/components/catalog-filters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collection" };

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    price?: string;
    q?: string;
    page?: string;
  }>;
}

async function ItemGrid({
  category,
  price,
  q,
  page,
}: {
  category: string;
  price: string;
  q: string;
  page: number;
}) {
  const where: Prisma.ItemWhereInput = {};

  if (category && Object.values(ItemCategory).includes(category as ItemCategory)) {
    where.category = category as ItemCategory;
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

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
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
      },
    }),
    prisma.item.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const itemsWithRating = items.map((item) => {
    const { reviews, ...rest } = item;
    const avgRating = reviews.length >= 3
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;
    return { ...rest, avgRating, reviewCount: reviews.length };
  });

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-stone-400 text-sm tracking-widest uppercase">
          No items found
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-stone-400 tracking-widest uppercase">
          {total} {total === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsWithRating.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}${category ? `&category=${category}` : ""}${price ? `&price=${price}` : ""}${q ? `&q=${q}` : ""}`}
              className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                p === page
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-200 text-stone-600 hover:border-stone-900"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category ?? "";
  const price = sp.price ?? "";
  const q = sp.q ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
            marianni Collection
          </p>
          <h1 className="text-4xl font-light tracking-tight text-stone-900">
            Luxury Rentals
          </h1>
        </header>

        <div className="mb-8 p-6 bg-white border border-stone-200">
          <Suspense>
            <CatalogFilters category={category} priceRange={price} search={q} />
          </Suspense>
        </div>

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
          <ItemGrid category={category} price={price} q={q} page={page} />
        </Suspense>
      </main>

      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs tracking-wider text-stone-400 uppercase">
          © {new Date().getFullYear()} marianni
        </div>
      </footer>
    </div>
  );
}
