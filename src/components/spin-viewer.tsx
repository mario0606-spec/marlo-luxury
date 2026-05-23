"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface SpinViewerProps {
  frames: string[];
  alt: string;
}

export function SpinViewer({ frames, alt }: SpinViewerProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startIndexRef = useRef(0);
  const count = frames.length;

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      setFrameIndex(((i % count) + count) % count);
    },
    [count],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      startXRef.current = e.clientX;
      startIndexRef.current = frameIndex;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [frameIndex],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || count === 0) return;
      const container = containerRef.current;
      if (!container) return;
      const dx = e.clientX - startXRef.current;
      const sensitivity = container.clientWidth / count;
      const frameDelta = Math.round(dx / sensitivity);
      goTo(startIndexRef.current + frameDelta);
    },
    [isDragging, count, goTo],
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!containerRef.current?.matches(":focus-within")) return;
      if (e.key === "ArrowRight") goTo(frameIndex + 1);
      if (e.key === "ArrowLeft") goTo(frameIndex - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [frameIndex, goTo]);

  if (count === 0) {
    return (
      <div className="aspect-square bg-white border border-stone-200 flex items-center justify-center">
        <span className="text-xs tracking-widest uppercase text-stone-300">No 360 frames</span>
      </div>
    );
  }

  const loaded = loadedCount >= count;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-label={`360 degree view of ${alt}. Drag to rotate.`}
      aria-valuemin={0}
      aria-valuemax={count - 1}
      aria-valuenow={frameIndex}
      className="relative aspect-square bg-white border border-stone-200 overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
      style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {frames.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={i === frameIndex ? `${alt} — angle ${Math.round((i / count) * 360)}°` : ""}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{ opacity: i === frameIndex ? 1 : 0, position: "absolute" }}
          priority={i === 0}
          loading={i === 0 ? "eager" : "lazy"}
          onLoad={() => setLoadedCount((c) => c + 1)}
        />
      ))}

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 pointer-events-none">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs tracking-widest uppercase text-stone-500">
              Loading 360°
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-stone-200 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-stone-500">
          <path d="M2 8h12M2 8l3-3M2 8l3 3M14 8l-3-3M14 8l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] tracking-widest uppercase text-stone-500">Drag to rotate</span>
      </div>
    </div>
  );
}
