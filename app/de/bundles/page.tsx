import Link from "next/link";
import { occasionBundles } from "@/lib/bundles";

export const metadata = {
  title: "Occasion Bundles — Marlo",
  description: "Luxusuhren für besondere Anlässe. Ein Preis, alles inklusive.",
};

export default function BundlesPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-marlo-gold/20 px-6 py-8 text-center">
        <h1 className="text-4xl tracking-tight">Occasion Bundles</h1>
        <p className="mt-3 text-lg text-marlo-dark/70 max-w-xl mx-auto">
          Ein Anlass. Eine Uhr. Ein Preis. Alles inklusive — Sie buchen das Erlebnis.
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {occasionBundles.map((bundle) => (
          <Link
            key={bundle.bundleSlug}
            href={`/de/bundles/${bundle.bundleSlug}`}
            className="group block border border-marlo-gold/20 rounded-lg p-6 hover:border-marlo-gold transition-colors bg-white"
          >
            <span className="text-xs uppercase tracking-widest text-marlo-gold">
              {bundle.occasion}
            </span>
            <h2 className="mt-2 text-xl font-medium leading-tight group-hover:text-marlo-gold transition-colors">
              {bundle.displayName}
            </h2>
            <p className="mt-3 text-sm text-marlo-dark/60">
              {bundle.durationDays} Tage · {bundle.watchFamily}
            </p>
            <p className="mt-4 text-2xl font-medium">
              {bundle.priceEur.toLocaleString("de-DE")} €
            </p>
            <p className="text-xs text-marlo-dark/50 mt-1">inkl. MwSt.</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
