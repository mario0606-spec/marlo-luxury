import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { CrispChat } from "@/components/crisp-chat";
import { LangProvider } from "@/lib/lang-context";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "marianni — Trage den Moment.",
    template: "%s | marianni",
  },
  description:
    "Luxusuhren der renommiertesten Marken mieten — für Hochzeiten, Galas oder jeden außergewöhnlichen Moment. Tagesmiete, Wochenmiete oder Monatsabonnement.",
  keywords: [
    "Uhren mieten",
    "Luxusuhr mieten",
    "Rolex mieten Deutschland",
    "Patek Philippe mieten",
    "Uhren Verleih DACH",
    "Luxus Abonnement",
  ],
  openGraph: {
    title: "marianni — Trage den Moment.",
    description:
      "Leihe ikonische Uhren der weltweit renommiertesten Marken. Ab einem Anlass.",
    type: "website",
    siteName: "marianni",
  },
  twitter: {
    card: "summary_large_image",
    title: "marianni — Trage den Moment.",
    description:
      "Luxusuhren mieten für jeden Anlass. Abonnements und Einzelmieten verfügbar.",
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
    <html lang="de" className={`scroll-smooth ${displayFont.variable} ${sansFont.variable}`}>
      <body>
        <LangProvider>
          <SessionProvider>{children}</SessionProvider>
        </LangProvider>
        <CrispChat />
      </body>
    </html>
  );
}
