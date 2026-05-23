"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface WatchGalleryProps {
  images: string[];
  alt: string;
}

export function WatchGallery({ images, alt }: WatchGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const safeImages = images.length > 0 ? images : [];
  const count = safeImages.length;

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      const next = ((i % count) + count) % count;
      setIndex(next);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightbox) {
        if (e.key === "Escape") setLightbox(false);
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, next, prev]);

  // Focus trap when lightbox opens
  useEffect(() => {
    if (lightbox) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      closeBtnRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      lastFocusedRef.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // Mobile swipe via scroll snap
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const w = track.clientWidth;
      if (w === 0) return;
      const i = Math.round(track.scrollLeft / w);
      if (i !== index) setIndex(i);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [index]);

  if (count === 0) {
    return (
      <div className="aspect-square bg-white border border-stone-200 flex items-center justify-center">
        <span className="text-xs tracking-widest uppercase text-stone-300">No image</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hero */}
      <div className="relative">
        {/* Desktop / large hero */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Open image in lightbox"
          className="hidden sm:block aspect-square w-full bg-white border border-stone-200 overflow-hidden relative cursor-zoom-in group"
        >
          <Image
            src={safeImages[index]}
            alt={`${alt} — image ${index + 1} of ${count}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </button>

        {/* Mobile swipe track */}
        <div
          ref={trackRef}
          className="sm:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {safeImages.map((src, i) => (
            <div
              key={i}
              className="snap-center shrink-0 w-full aspect-square bg-white border border-stone-200 relative"
            >
              <Image
                src={src}
                alt={`${alt} — image ${i + 1} of ${count}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Mobile dot indicators */}
        {count > 1 && (
          <div className="sm:hidden flex justify-center gap-1.5 mt-3" aria-hidden="true">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-stone-900" : "w-1.5 bg-stone-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop thumbnails */}
      {count > 1 && (
        <div className="hidden sm:grid grid-cols-5 gap-2">
          {safeImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`aspect-square bg-white border overflow-hidden relative transition ${
                i === index
                  ? "border-stone-900 ring-1 ring-stone-900"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="10vw" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 bg-stone-950/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-2xl w-12 h-12 flex items-center justify-center"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-2xl w-12 h-12 flex items-center justify-center"
              >
                ›
              </button>
            </>
          )}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safeImages[index]}
              alt={`${alt} — image ${index + 1} of ${count}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs tracking-widest uppercase text-white/60">
            {index + 1} / {count}
          </div>
        </div>
      )}
    </div>
  );
}
