"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispChat() {
  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!websiteId) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    // Set auto-message after brief delay so Crisp is initialised
    const timer = setTimeout(() => {
      if (Array.isArray(window.$crisp)) {
        window.$crisp.push(["safe", true]);
        window.$crisp.push([
          "message:show",
          "text",
          "Leihen Sie dieses Wochenende eine Uhr? Wir sind da, wenn Sie etwas brauchen.",
        ]);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
}
