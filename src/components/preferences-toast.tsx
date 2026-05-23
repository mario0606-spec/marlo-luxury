"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function PreferencesToast() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("toast") !== "preferences-updated") return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 4000);
    window.history.replaceState({}, "", window.location.pathname);
    return () => clearTimeout(t);
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-sm px-5 py-3 shadow-md max-w-[380px] w-[calc(100vw-32px)]">
      Your preferences have been updated — we&rsquo;ll apply these to your next selection.
    </div>
  );
}
