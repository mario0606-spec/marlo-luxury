"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpinViewerProps {
  frames: string[];
  alt: string;
  className?: string;
}

export function SpinViewer({ frames, alt, className = "" }: SpinViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartFrame = useRef(0);
  const prefersReducedMotion = useRef(false);

  const frameCount = frames.length;

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    let loadedCount = 0;
    const images = frames.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frames.length) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frames.length) setLoaded(true);
      };
      return img;
    });
    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [frames]);

  const updateFrame = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = clientX - dragStartX.current;
      const sensitivity = rect.width / frameCount;
      const frameDelta = Math.round(deltaX / sensitivity);
      const newFrame =
        ((dragStartFrame.current + frameDelta) % frameCount + frameCount) %
        frameCount;
      setCurrentFrame(newFrame);
    },
    [frameCount]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartFrame.current = currentFrame;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [currentFrame]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      updateFrame(e.clientX);
    },
    [isDragging, updateFrame]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentFrame((prev) => (prev - 1 + frameCount) % frameCount);
      } else if (e.key === "ArrowRight") {
        setCurrentFrame((prev) => (prev + 1) % frameCount);
      }
    },
    [frameCount]
  );

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square bg-[#fafaf8] select-none overflow-hidden ${className}`}
      role="img"
      aria-label={`360° Ansicht: ${alt}`}
      aria-roledescription="360° Drehansicht"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
    >
      {frames.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === currentFrame ? alt : ""}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-100"
          style={{ opacity: i === currentFrame ? 1 : 0 }}
          draggable={false}
          loading="lazy"
        />
      ))}

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs uppercase tracking-widest text-marlo-dark/40">
            Lade 360°…
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="text-[11px] uppercase tracking-widest text-marlo-dark/40">
          {isDragging
            ? `${Math.round((currentFrame / frameCount) * 360)}°`
            : "Ziehen zum Drehen"}
        </span>
      </div>
    </div>
  );
}
