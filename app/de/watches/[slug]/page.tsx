import Link from "next/link";
import type { Metadata } from "next";
import { watchCatalog, getWatchBySlug } from "@/lib/watches";
import { occasionBundles } from "@/lib/bundles";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { BASE_URL, hreflangAlternates, truncate } from "@/lib/seo";

export function generateStaticParams() {
  return watchCatalog.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const watch = getWatchBySlug(params.slug);
  const title = watch
    ? `${watch.name} mieten — Marlo`
    : `Uhr mieten — Marlo`;
  const description = watch
    ? `${watch.name} für besondere Anlässe mieten. Persönliche Übergabe, Premium-Versicherung, Concierge inklusive.`
    : "Luxusuhr für besondere Anlässe mieten. Persönliche Übergabe, Premium-Versicherung, Concierge inklusive.";
  const path = `/de/watches/${params.slug}`;
  return {
    title: truncate(title, 60),
    description: truncate(description, 155),
    alternates: hreflangAlternates(path),
  };
}

function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function WatchPage({
  params,
}: {
  params: { slug: string };
}) {
  const watch = getWatchBySlug(params.slug);

  const bundleForWatch = watch
    ? occasionBundles.find((b) => b.watchPool.includes(watch.slug))
    : null;

  const displayName = watch ? watch.name : slugToDisplayName(params.slug);
  const brand = watch ? watch.brand : null;

  return (
    <main className="min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { name: "Marlo", href: "/de" },
          { name: "Uhren", href: "/de/bundles" },
          { name: displayName, href: `/de/watches/${params.slug}` },
        ]}
      />

      <header className="border-b border-marlo-gold/20 px-6 py-6">
        <Link
          href="/de/stories"
          className="text-sm text-marlo-dark/60 hover:text-marlo-gold"
        >
          &larr; Zurück zu den Stories
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square bg-marlo-dark/5 rounded-xl flex items-center justify-center">
            {watch ? (
              <span className="text-sm text-marlo-dark/30 text-center px-4">
                {watch.name}
              </span>
            ) : (
              <span className="text-sm text-marlo-dark/30 text-center px-4">
                {displayName}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {brand && (
              <p className="text-xs uppercase tracking-widest text-marlo-gold mb-2">
                {brand}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-medium leading-tight">
              {displayName}
            </h1>

            {watch?.rentalStartingPriceEur ? (
              <div className="mt-6">
                <p className="text-3xl font-medium">
                  ab {watch.rentalStartingPriceEur.toLocaleString("de-DE")} €
                </p>
                <p className="text-sm text-marlo-dark/50 mt-1">
                  inkl. Versicherung · persönliche Übergabe · Concierge
                </p>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-lg font-medium text-marlo-dark/60">
                  Preis auf Anfrage
                </p>
                <p className="text-sm text-marlo-dark/40 mt-1">
                  inkl. Versicherung · persönliche Übergabe · Concierge
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              {bundleForWatch ? (
                <>
                  <Link
                    href={`/de/bundles/${bundleForWatch.bundleSlug}/buchen`}
                    className="inline-block bg-marlo-dark text-white px-6 py-3 rounded hover:bg-marlo-gold transition-colors text-sm font-medium text-center"
                  >
                    Jetzt buchen
                  </Link>
                  <Link
                    href={`/de/bundles/${bundleForWatch.bundleSlug}`}
                    className="inline-block border border-marlo-gold/30 text-marlo-dark px-6 py-3 rounded hover:border-marlo-gold transition-colors text-sm font-medium text-center"
                  >
                    Bundle Details ansehen
                  </Link>
                </>
              ) : (
                <Link
                  href="/de/bundles"
                  className="inline-block bg-marlo-dark text-white px-6 py-3 rounded hover:bg-marlo-gold transition-colors text-sm font-medium text-center"
                >
                  Alle Bundles ansehen
                </Link>
              )}
            </div>

            <div className="mt-8 border-t border-marlo-gold/20 pt-6 space-y-2">
              {[
                "Persönliche Übergabe in Berlin, München oder Hamburg",
                "Premium-Versicherung inklusive",
                "24/7 Concierge-Hotline",
                "Rückversand inklusive",
              ].map((item) => (
                <p key={item} className="text-sm text-marlo-dark/60 flex items-start gap-2">
                  <span className="text-marlo-gold mt-0.5">&#10003;</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
