import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Marlo Luxury Rentals collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-stone-400 text-sm mb-12">Last updated: May 2026</p>

        <div className="prose prose-stone max-w-none text-stone-600 text-sm leading-relaxed space-y-8">
          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Overview
            </h2>
            <p>
              Marlo Luxury Rentals (&ldquo;Marlo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to
              protecting your personal information. This policy explains what data we collect,
              how we use it, and your rights.
            </p>
            <p className="mt-3 text-stone-400 italic">
              This is a placeholder document. A full privacy policy will be published before
              launch. If you have questions, contact us directly.
            </p>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-stone-500">
              <li>Email address and name when you join our waitlist</li>
              <li>Account information when you register</li>
              <li>Rental and payment history when you use our services</li>
              <li>Usage data to improve our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              How We Use Your Data
            </h2>
            <ul className="list-disc list-inside space-y-2 text-stone-500">
              <li>To process and fulfill rental orders</li>
              <li>To send waitlist and launch notifications (with your consent)</li>
              <li>To verify identity and prevent fraud</li>
              <li>To improve our services and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time.
              To exercise these rights, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-stone-900 text-base font-medium tracking-wide uppercase mb-3">
              Contact
            </h2>
            <p>
              For privacy-related questions, please reach out to us at{" "}
              <span className="text-stone-700">privacy@marlo.luxury</span>.
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
