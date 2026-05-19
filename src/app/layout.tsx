import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { CrispChat } from "@/components/crisp-chat";

export const metadata: Metadata = {
  title: {
    default: "Marlo — Wear Luxury. Pay Per Occasion.",
    template: "%s | Marlo",
  },
  description:
    "Rent luxury watches, jewelry, and accessories for any occasion. Flexible daily, weekly, or monthly rentals. Subscription plans available.",
  keywords: [
    "luxury rentals",
    "watch rental",
    "jewelry rental",
    "Rolex rental",
    "Cartier rental",
    "luxury accessories",
    "luxury subscription",
  ],
  openGraph: {
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic watches and fine jewelry from the world's finest brands. Starting from one occasion.",
    type: "website",
    siteName: "Marlo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic watches and fine jewelry for any occasion. Subscription plans and one-time rentals available.",
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
        <CrispChat />
      </body>
    </html>
  );
}
