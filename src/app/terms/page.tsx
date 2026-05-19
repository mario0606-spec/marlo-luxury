import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing use of Marlo Luxury Rentals.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl tracking-[0.35em] font-light uppercase text-stone-900 hover:text-stone-700 transition-colors"
          >
            Marlo
          </Link>
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
            ← Back
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-20">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4 font-light">
          Legal
        </p>
        <h1 className="text-4xl font-light text-stone-900 tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-stone-400 text-sm mb-12">Last updated: May 2026</p>

        <div className="prose prose-stone max-w-none text-stone-600 text-sm leading-relaxed space-y-8">
          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Overview
            </h2>
            <p>
              By using Marlo Luxury Rentals (&ldquo;Marlo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), you agree
              to these terms of service. Please read them carefully.
            </p>
            <p className="mt-3 text-stone-400 italic">
              This is a placeholder document. Full terms of service will be published before
              launch. If you have questions, contact us directly.
            </p>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Rental Terms
            </h2>
            <ul className="list-disc list-inside space-y-2 text-stone-500">
              <li>All items must be returned in the same condition they were received</li>
              <li>A refundable security deposit is required for all rentals</li>
              <li>Late returns are subject to additional daily charges</li>
              <li>Damage beyond normal wear may result in deposit forfeiture</li>
            </ul>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Eligibility
            </h2>
            <p>
              You must be at least 18 years of age and provide valid identification to
              rent from Marlo. We reserve the right to decline any rental request.
            </p>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Liability
            </h2>
            <p>
              Marlo is not liable for any loss, damage, or injury arising from the use of
              rented items. All items are insured; customers are responsible for their
              care during the rental period.
            </p>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Governing Law
            </h2>
            <p>
              These terms are governed by German law. Any disputes shall be resolved in
              the courts of Germany.
            </p>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Contact
            </h2>
            <p>
              For questions about these terms, please contact us at{" "}
              <span className="text-stone-700">legal@marlo.luxury</span>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-stone-400">
            <Link href="/privacy" className="hover:text-stone-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-700 transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-stone-400 text-xs mt-4">
            &copy; {new Date().getFullYear()} Marlo Luxury Rentals
          </p>
        </div>
      </footer>
    </div>
  );
}
