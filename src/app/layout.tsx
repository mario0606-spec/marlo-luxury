import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://marlo.luxury"
  ),
  title: {
    default: "Marlo — Wear Luxury. Pay Per Occasion.",
    template: "%s | Marlo",
  },
  description:
    "Rent iconic luxury watches for any occasion. Flexible daily, weekly, or monthly rentals. Rolex, Patek Philippe, Audemars Piguet, and more.",
  keywords: [
    "luxury watch rental",
    "watch rental",
    "Rolex rental",
    "Patek Philippe rental",
    "Audemars Piguet rental",
    "luxury timepiece rental",
    "luxury subscription",
    "Uhren mieten",
    "Luxusuhr leihen",
  ],
  openGraph: {
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic luxury watches from the world's finest brands. Starting from one occasion.",
    type: "website",
    siteName: "Marlo",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic luxury watches for any occasion. Subscription plans and one-time rentals available.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`scroll-smooth ${cormorant.variable} ${lato.variable}`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
        >
          Zum Hauptinhalt springen
        </a>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
