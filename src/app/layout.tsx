import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { CrispChat } from "@/components/crisp-chat";
import { LangProvider } from "@/lib/lang-context";

export const metadata: Metadata = {
  title: {
    default: "marianni — Luxus tragen. Pro Anlass zahlen.",
    template: "%s | marianni",
  },
  description:
    "Luxusuhren und feinen Schmuck der renommiertesten Marken mieten — für jeden Anlass. Tagesmiete, Wochenmiete oder Monatsabonnement.",
  keywords: [
    "Luxus mieten",
    "Uhren mieten",
    "Schmuck mieten",
    "Rolex mieten",
    "Cartier mieten",
    "Luxus Accessoires",
    "Luxus Abonnement",
    "DACH",
  ],
  openGraph: {
    title: "marianni — Luxus tragen. Pro Anlass zahlen.",
    description:
      "Leihe ikonische Uhren und feinen Schmuck der weltweit renommiertesten Marken. Ab einem Anlass.",
    type: "website",
    siteName: "marianni",
  },
  twitter: {
    card: "summary_large_image",
    title: "marianni — Luxus tragen. Pro Anlass zahlen.",
    description:
      "Luxusuhren und feinen Schmuck mieten für jeden Anlass. Abonnements und Einzelmieten verfügbar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body>
        <LangProvider>
          <SessionProvider>{children}</SessionProvider>
        </LangProvider>
        <CrispChat />
      </body>
    </html>
  );
}
