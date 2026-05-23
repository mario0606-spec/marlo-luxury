"use client";

import { useEffect, useRef, useState } from "react";

interface ModelViewerARProps {
  glbUrl: string;
  usdzUrl?: string;
  alt: string;
}

type ModelViewerAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    src?: string;
    "ios-src"?: string;
    alt?: string;
    ar?: boolean;
    "ar-modes"?: string;
    "camera-controls"?: boolean;
    "touch-action"?: string;
    "shadow-intensity"?: string;
    "auto-rotate"?: boolean;
    loading?: string;
    poster?: string;
    "environment-image"?: string;
    exposure?: string;
  },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}

export function ModelViewerAR({ glbUrl, usdzUrl, alt }: ModelViewerARProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setScriptReady(true);
      return;
    }
    import("@google/model-viewer").then(() => setScriptReady(true));
  }, []);

  useEffect(() => {
    if (!scriptReady) return;
    const mv = containerRef.current?.querySelector("model-viewer");
    if (!mv) return;
    const onLoad = () => setLoaded(true);
    mv.addEventListener("load", onLoad);
    return () => mv.removeEventListener("load", onLoad);
  }, [scriptReady]);

  return (
    <div ref={containerRef} className="relative aspect-square bg-white border border-stone-200 overflow-hidden">
      {scriptReady && (
        <model-viewer
          src={glbUrl}
          ios-src={usdzUrl}
          alt={`3D model of ${alt}`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          touch-action="pan-y"
          shadow-intensity="1"
          auto-rotate
          loading="lazy"
          environment-image="neutral"
          exposure="0.9"
          style={{ width: "100%", height: "100%" }}
        />
      )}

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 pointer-events-none">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs tracking-widest uppercase text-stone-500">
              Loading 3D Model
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-stone-200 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-stone-500">
          <path d="M8 2v12M8 2L5 5M8 2l3 3M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] tracking-widest uppercase text-stone-500">
          Interact to explore · Tap AR to try on
        </span>
      </div>
    </div>
  );
}
