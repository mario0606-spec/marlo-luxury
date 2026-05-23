"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ItemCard } from "@/components/item-card";

interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  dailyRate: number;
  weeklyRate: number | null;
  images: string[];
  available: boolean;
  featured: boolean;
  availableFrom: string | null;
  isFavorited?: boolean;
  averageRating: number | null;
  reviewCount?: number;
}

interface CatalogGridProps {
  initialItems: CatalogItem[];
  total: number;
  showAvailableBadge: boolean;
}

function EmptyFilterState() {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <svg
        className="w-24 h-12 mx-auto mb-6"
        viewBox="0 0 120 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="30" cy="24" r="18" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
        <circle cx="60" cy="24" r="18" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
        <circle cx="90" cy="24" r="18" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
      </svg>
      <h2 className="text-xl font-light text-stone-900 mb-3">
        Keine Stücke gefunden
      </h2>
      <p className="text-sm text-stone-500 max-w-xs mb-6">
        Versuche, Filter anzupassen oder alle Filter zurückzusetzen, um mehr
        Stücke zu entdecken.
      </p>
      <a
        href="/catalog"
        className="btn-outline text-xs tracking-wider uppercase px-6 py-3"
      >
        Filter zurücksetzen
      </a>
    </div>
  );
}

function EmptyCatalogState() {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <svg
        className="w-24 h-12 mx-auto mb-6"
        viewBox="0 0 120 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="30" cy="24" r="18" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
        <circle cx="60" cy="24" r="18" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
        <circle cx="90" cy="24" r="18" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
      </svg>
      <h2 className="text-xl font-light text-stone-900 mb-3">
        Unsere Kollektion wächst
      </h2>
      <p className="text-sm text-stone-500 max-w-xs mb-6">
        Hochwertige Stücke werden gerade kuratiert. Schau bald wieder vorbei.
      </p>
      <a
        href="/account/favorites"
        className="btn-outline text-xs tracking-wider uppercase px-6 py-3"
      >
        Wunschliste erstellen
      </a>
    </div>
  );
}

export function CatalogGrid({
  initialItems,
  total,
  showAvailableBadge,
}: CatalogGridProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const hasFilters = !!(
    searchParams.get("category") ||
    searchParams.get("brand") ||
    searchParams.get("price") ||
    searchParams.get("available") ||
    searchParams.get("q")
  );

  const remaining = total - items.length;

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(nextPage));
      const res = await fetch(`/api/catalog-items?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [...prev, ...data.items]);
        setCurrentPage(nextPage);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchParams]);

  if (items.length === 0) {
    return hasFilters ? <EmptyFilterState /> : <EmptyCatalogState />;
  }

  return (
    <div>
      <p className="text-xs text-stone-600 tracking-widest uppercase mb-6">
        {items.length} von {total} Stücken
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <ItemCard
            key={item.id}
            item={item}
            isFavorited={item.isFavorited}
            averageRating={item.averageRating}
            reviewCount={item.reviewCount}
            priority={idx < 3}
            availableFrom={item.availableFrom}
            showAvailableBadge={showAvailableBadge}
          />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn-outline text-sm tracking-wider uppercase px-8 py-3.5 w-full sm:w-auto disabled:opacity-50"
          >
            {loading
              ? "Wird geladen…"
              : `Weitere Stücke laden (${remaining})`}
          </button>
        </div>
      )}

      {/* Noscript fallback: numbered pagination */}
      <noscript>
        <nav aria-label="Pagination" className="mt-12 flex justify-center gap-2">
          {Array.from(
            { length: Math.ceil(total / 12) },
            (_, i) => i + 1,
          ).map((p) => (
            <a
              key={p}
              href={`?page=${p}&${searchParams.toString()}`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm border border-stone-200 text-stone-700 hover:border-stone-900"
            >
              {p}
            </a>
          ))}
        </nav>
      </noscript>
    </div>
  );
}
