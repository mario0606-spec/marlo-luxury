"use client";

import { useEffect, useRef, useState } from "react";

interface ModelViewerARProps {
  glbSrc: string;
  usdzSrc?: string | null;
  posterSrc: string;
  alt: string;
  className?: string;
}

// swap-when-funded: WANNA SDK — add wrist/hand try-on AR behind feature flag, keep model-viewer as fallback
export function ModelViewerAR({
  glbSrc,
  usdzSrc,
  posterSrc,
  alt,
  className = "",
}: ModelViewerARProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  if (!scriptLoaded) {
    return (
      <div
        className={`relative aspect-square bg-[#fafaf8] flex items-center justify-center ${className}`}
      >
        <div className="text-xs uppercase tracking-widest text-marlo-dark/40">
          Lade 3D-Ansicht…
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative aspect-square ${className}`}>
      {/* @ts-expect-error model-viewer is a web component loaded via script */}
      <model-viewer
        src={glbSrc}
        ios-src={usdzSrc || undefined}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        poster={posterSrc}
        alt={alt}
        loading="lazy"
        reveal="interaction"
        auto-rotate
        auto-rotate-delay="3000"
        interaction-prompt="auto"
        shadow-intensity="0.5"
        environment-image="neutral"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fafaf8",
          "--poster-color": "#fafaf8",
        } as React.CSSProperties}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-marlo-dark text-white border border-marlo-gold/40 rounded-sm px-4 py-2 text-xs font-medium uppercase tracking-widest hover:bg-marlo-gold hover:text-marlo-dark transition-colors focus-visible:outline-2 focus-visible:outline-marlo-gold focus-visible:outline-offset-2"
          aria-label="Diese Uhr in Augmented Reality ansehen"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
            <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
          </svg>
          In AR ansehen
        </button>

        <div
          slot="poster"
          className="absolute inset-0 flex items-center justify-center bg-[#fafaf8]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterSrc}
            alt={alt}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span className="text-[11px] uppercase tracking-widest text-marlo-dark/40">
              Tippen für 3D
            </span>
          </div>
        </div>
      {/* @ts-expect-error model-viewer is a web component */}
      </model-viewer>
    </div>
  );
}
