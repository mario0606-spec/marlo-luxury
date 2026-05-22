import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "marianni — Luxus tragen. Pro Anlass zahlen.",
  description:
    "Leihe ikonische Uhren und feinen Schmuck der renommiertesten Marken — für Hochzeiten, Galas oder jeden außergewöhnlichen Moment.",
  keywords: [
    "Uhren mieten",
    "Schmuck mieten",
    "Luxus mieten Deutschland",
    "Rolex mieten",
    "Cartier mieten",
    "Luxus Abonnement DACH",
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
};

export default async function Page() {
  const session = await auth();
  return <LandingPage session={session} />;
}
