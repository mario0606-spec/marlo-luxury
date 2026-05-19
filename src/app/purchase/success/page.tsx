import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Purchase Complete — Marlo" };

export default function PurchaseSuccessPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-12 h-12 mx-auto mb-8 rounded-full bg-green-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-3xl font-light tracking-wide text-stone-900 mb-4">Purchase Complete</h1>
      <p className="text-stone-500 mb-2">
        Congratulations — this piece is now yours.
      </p>
      <p className="text-stone-400 text-sm mb-12">
        Our concierge team will be in touch shortly to arrange delivery or pickup.
      </p>
      <Link
        href="/dashboard/rentals"
        className="inline-block border border-stone-900 text-stone-900 px-8 py-3 text-sm tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-colors"
      >
        View My Rentals
      </Link>
    </main>
  );
}
