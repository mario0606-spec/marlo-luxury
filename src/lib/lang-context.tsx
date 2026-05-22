"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "de" | "en";

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({ lang: "de", toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("de");

  useEffect(() => {
    const stored = localStorage.getItem("marianni-lang") as Lang | null;
    if (stored === "en" || stored === "de") setLang(stored);
  }, []);

  function toggle() {
    setLang((prev) => {
      const next: Lang = prev === "de" ? "en" : "de";
      localStorage.setItem("marianni-lang", next);
      return next;
    });
  }

  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
