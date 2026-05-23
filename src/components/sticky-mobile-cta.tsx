"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface StickyMobileCTAProps {
  itemSlug: string;
  dailyRate: number;
  available: boolean;
  isSignedIn: boolean;
  // Sentinel element to observe — when out of view, CTA appears.
  sentinelId: string;
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function StickyMobileCTA({
  itemSlug,
  dailyRate,
  available,
  isSignedIn,
  sentinelId,
}: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const target = document.getElementById(sentinelId);
    if (!target) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0 },
    );
    observerRef.current.observe(target);
    return () => observerRef.current?.disconnect();
  }, [sentinelId]);

  const href = available
    ? isSignedIn
      ? `/book/${itemSlug}`
      : `/auth/signin?callbackUrl=/book/${itemSlug}`
    : "#";

  return (
    <div
      aria-hidden={!visible}
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-stone-500">From</p>
          <p className="text-base font-light text-stone-900">
            {formatEur(dailyRate)} <span className="text-xs text-stone-500">/ day</span>
          </p>
        </div>
        {available ? (
          <Link
            href={href}
            tabIndex={visible ? 0 : -1}
            className="btn-primary px-6 py-2.5 text-sm whitespace-nowrap"
          >
            Book
          </Link>
        ) : (
          <button
            disabled
            className="btn-primary px-6 py-2.5 text-sm opacity-40 cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
