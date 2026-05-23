"use client";

import { useState } from "react";
import { WatchGallery } from "./watch-gallery";
import { SpinViewer } from "./spin-viewer";
import { ModelViewerAR } from "./model-viewer-ar";

type Tab = "photos" | "360" | "ar";

interface ImmersiveGalleryProps {
  images: string[];
  images360: string[];
  arModelGlb: string | null;
  arModelUsdz: string | null;
  arEnabled: boolean;
  alt: string;
}

export function ImmersiveGallery({
  images,
  images360,
  arModelGlb,
  arModelUsdz,
  arEnabled,
  alt,
}: ImmersiveGalleryProps) {
  const has360 = images360.length > 0;
  const hasAR = arEnabled && !!arModelGlb;
  const showTabs = has360 || hasAR;

  const [activeTab, setActiveTab] = useState<Tab>("photos");

  if (!showTabs) {
    return <WatchGallery images={images} alt={alt} />;
  }

  const tabs: { key: Tab; label: string; available: boolean }[] = [
    { key: "photos", label: "Photos", available: true },
    { key: "360", label: "360°", available: has360 },
    { key: "ar", label: "AR Try-On", available: hasAR },
  ];

  return (
    <div className="space-y-3">
      <div
        role="tablist"
        aria-label="Product view"
        className="flex border border-stone-200 bg-white"
      >
        {tabs
          .filter((t) => t.available)
          .map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${
                activeTab === tab.key
                  ? "text-stone-900 border-b-2 border-stone-900 font-medium"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      <div id="panel-photos" role="tabpanel" hidden={activeTab !== "photos"}>
        {activeTab === "photos" && <WatchGallery images={images} alt={alt} />}
      </div>

      {has360 && (
        <div id="panel-360" role="tabpanel" hidden={activeTab !== "360"}>
          {activeTab === "360" && <SpinViewer frames={images360} alt={alt} />}
        </div>
      )}

      {hasAR && arModelGlb && (
        <div id="panel-ar" role="tabpanel" hidden={activeTab !== "ar"}>
          {activeTab === "ar" && (
            <ModelViewerAR
              glbUrl={arModelGlb}
              usdzUrl={arModelUsdz ?? undefined}
              alt={alt}
            />
          )}
        </div>
      )}
    </div>
  );
}
