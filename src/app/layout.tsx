import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
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
  ],
  openGraph: {
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic luxury watches from the world's finest brands. Starting from one occasion.",
    type: "website",
    siteName: "Marlo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic luxury watches for any occasion. Subscription plans and one-time rentals available.",
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
    <html lang="en" className="scroll-smooth">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
