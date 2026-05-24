"use client";

import { useState } from "react";
import type { WatchAssets } from "@/lib/watches";
import { SpinViewer } from "./SpinViewer";
import { ModelViewerAR } from "./ModelViewerAR";

type Tab = "photos" | "360" | "ar";

interface ImmersiveGalleryProps {
  watch: WatchAssets;
  className?: string;
}

export function ImmersiveGallery({ watch, className = "" }: ImmersiveGalleryProps) {
  const has360 = watch.images360.length > 0;
  const hasAR = watch.arEnabled && watch.arModelGlb !== null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "photos", label: "Fotos" },
    ...(has360 ? [{ key: "360" as Tab, label: "360°" }] : []),
    ...(hasAR ? [{ key: "ar" as Tab, label: "AR" }] : []),
  ];

  const [activeTab, setActiveTab] = useState<Tab>("photos");

  return (
    <div className={className}>
      {tabs.length > 1 && (
        <nav
          className="flex border-b border-marlo-gold/20 mb-0"
          role="tablist"
          aria-label="Produktansichten"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-xs font-medium uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-marlo-gold text-marlo-dark"
                  : "border-transparent text-marlo-dark/40 hover:text-marlo-dark/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      <div
        id="panel-photos"
        role="tabpanel"
        aria-labelledby="tab-photos"
        hidden={activeTab !== "photos"}
      >
        <div className="aspect-square bg-[#fafaf8] flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={watch.heroImage}
            alt={watch.name}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>
      </div>

      {has360 && (
        <div
          id="panel-360"
          role="tabpanel"
          aria-labelledby="tab-360"
          hidden={activeTab !== "360"}
        >
          {activeTab === "360" && (
            <SpinViewer frames={watch.images360} alt={watch.name} />
          )}
        </div>
      )}

      {hasAR && watch.arModelGlb && (
        <div
          id="panel-ar"
          role="tabpanel"
          aria-labelledby="tab-ar"
          hidden={activeTab !== "ar"}
        >
          {activeTab === "ar" && (
            <ModelViewerAR
              glbSrc={watch.arModelGlb}
              usdzSrc={watch.arModelUsdz}
              posterSrc={watch.posterImage}
              alt={`3D-Ansicht: ${watch.name}`}
            />
          )}
        </div>
      )}
    </div>
  );
}
