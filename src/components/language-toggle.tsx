"use client";

import { useLang } from "@/lib/lang-context";

export function LanguageToggle() {
  const { lang, toggle } = useLang();

  return (
    <button
      onClick={toggle}
      className="text-stone-400 hover:text-white text-xs tracking-widest uppercase transition-colors focus:outline-none focus:underline"
      aria-label={lang === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      {lang === "de" ? "EN" : "DE"}
    </button>
  );
}
