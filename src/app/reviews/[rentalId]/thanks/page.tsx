import Link from "next/link";
import { NavServer as Nav } from "@/components/nav-server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thank You — Marlo" };

export default function ReviewThanksPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-6">★</div>
        <h1 className="text-2xl font-light tracking-wide text-stone-900 mb-4">
          Thank you for your review
        </h1>
        <p className="text-stone-500 mb-10 leading-relaxed">
          Your experience helps other members discover the right pieces. Reviews appear after a brief moderation check.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/catalog" className="btn-primary">
            Browse Collection
          </Link>
          <Link href="/dashboard/rentals" className="btn-secondary">
            My Rentals
          </Link>
        </div>
      </main>
    </div>
  );
}
