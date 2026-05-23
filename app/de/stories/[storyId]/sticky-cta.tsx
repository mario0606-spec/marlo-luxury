"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function StickyCta({
  bundleSlug,
  displayName,
  priceEur,
}: {
  bundleSlug: string;
  displayName: string;
  priceEur: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-marlo-dark/95 backdrop-blur-sm border-t border-marlo-gold/30 px-4 py-3">
        <Link
          href={`/de/bundles/${bundleSlug}/buchen`}
          className="flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {displayName}
            </p>
            <p className="text-marlo-gold text-xs">
              ab {priceEur.toLocaleString("de-DE")} €
            </p>
          </div>
          <span className="shrink-0 bg-marlo-gold text-marlo-dark px-4 py-2 rounded text-sm font-medium">
            Mieten
          </span>
        </Link>
      </div>
    </div>
  );
}
