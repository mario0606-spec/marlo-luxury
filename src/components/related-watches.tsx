"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export interface RelatedWatch {
  id: string;
  slug: string;
  name: string;
  brand: string;
  dailyRate: number;
  images: string[];
}

interface RelatedWatchesProps {
  watches: RelatedWatch[];
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function RelatedWatches({ watches }: RelatedWatchesProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  if (watches.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    t.scrollBy({ left: dir * t.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="related-heading" className="border-t border-stone-200 pt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-500 mb-1">You may also like</p>
          <h2 id="related-heading" className="text-2xl font-light text-stone-900">
            More from the collection
          </h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="w-10 h-10 border border-stone-300 hover:border-stone-900 flex items-center justify-center text-stone-700 transition"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="w-10 h-10 border border-stone-300 hover:border-stone-900 flex items-center justify-center text-stone-700 transition"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {watches.map((w) => (
          <Link
            key={w.id}
            href={`/catalog/${w.slug}`}
            className="snap-start shrink-0 w-[66%] sm:w-[calc((100%-2rem)/3)] group"
          >
            <div className="aspect-square bg-white border border-stone-200 overflow-hidden relative mb-3">
              {w.images[0] && (
                <Image
                  src={w.images[0]}
                  alt={w.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 66vw, 33vw"
                />
              )}
            </div>
            <p className="text-[11px] tracking-widest uppercase text-stone-500">{w.brand}</p>
            <p className="text-sm text-stone-900 mt-0.5 truncate">{w.name}</p>
            <p className="text-xs text-stone-600 mt-1">{formatEur(w.dailyRate)} / day</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
