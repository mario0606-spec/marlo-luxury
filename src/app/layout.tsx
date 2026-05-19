import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: {
    default: "Marlo Luxury Rentals",
    template: "%s | Marlo Luxury Rentals",
  },
  description:
    "Rent luxury watches, jewelry, and accessories for any occasion. Subscription plans and one-time rentals available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
