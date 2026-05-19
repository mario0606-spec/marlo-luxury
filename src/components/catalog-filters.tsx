"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "WATCH", label: "Watches" },
  { value: "BAG", label: "Bags" },
  { value: "ACCESSORY", label: "Accessories" },
];

const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-10000", label: "Under €100/day" },
  { value: "10000-50000", label: "€100–€500/day" },
  { value: "50000-200000", label: "€500–€2,000/day" },
  { value: "200000-", label: "€2,000+/day" },
];

export function CatalogFilters({
  category,
  priceRange,
  search,
}: {
  category: string;
  priceRange: string;
  search: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Search */}
      <div className="flex-1 min-w-48">
        <label className="label">Search</label>
        <input
          type="search"
          defaultValue={search}
          placeholder="Brand, model…"
          className="input-field"
          onChange={(e) => updateParam("q", e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="input-field min-w-36"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="label">Price range</label>
        <select
          value={priceRange}
          onChange={(e) => updateParam("price", e.target.value)}
          className="input-field min-w-44"
        >
          {PRICE_RANGES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {(category || priceRange || search) && (
        <button
          onClick={() => router.push(pathname)}
          className="btn-outline py-3 text-xs"
        >
          Clear
        </button>
      )}
    </div>
  );
}
