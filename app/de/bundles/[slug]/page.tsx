import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBundleBySlug, occasionBundles } from "@/lib/bundles";
import { getStoryById } from "@/lib/stories";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { BASE_URL, hreflangAlternates, truncate } from "@/lib/seo";

export function generateStaticParams() {
  return occasionBundles.map((b) => ({ slug: b.bundleSlug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const bundle = getBundleBySlug(params.slug);
  if (!bundle) return {};
  const path = `/de/bundles/${bundle.bundleSlug}`;
  return {
    title: truncate(`${bundle.displayName} — Marlo`, 60),
    description: truncate(bundle.heroDescription, 155),
    alternates: hreflangAlternates(path),
  };
}

function BundleJsonLd({
  bundle,
}: {
  bundle: NonNullable<ReturnType<typeof getBundleBySlug>>;
}) {
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.displayName,
    description: bundle.heroDescription,
    brand: { "@type": "Brand", name: bundle.watchFamily },
    category: "Luxusuhr Miete",
    offers: {
      "@type": "Offer",
      price: bundle.priceEur,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/de/bundles/${bundle.bundleSlug}`,
      priceValidUntil: new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      ).toISOString().split("T")[0],
      itemCondition: "https://schema.org/UsedCondition",
    },
  };

  const faqEntries = [
    {
      question: `Was beinhaltet das ${bundle.displayName}?`,
      answer: `Das Bundle umfasst ${bundle.durationDays} Tage mit einer ${bundle.watchFamily}. Inklusive: ${bundle.includes.join(", ")}.`,
    },
    {
      question: `Wie viel kostet das ${bundle.displayName}?`,
      answer: `${bundle.priceEur} € für ${bundle.durationDays} Tage, inklusive MwSt., Versicherung und Concierge-Service.`,
    },
    {
      question: "Ist die Uhr versichert?",
      answer:
        "Ja, alle Marlo Occasion Bundles beinhalten eine Premium-Versicherung für die gesamte Mietdauer.",
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </>
  );
}

export default function BundleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const bundle = getBundleBySlug(params.slug);
  if (!bundle) notFound();

  const story = getStoryById(bundle.editorialAnchorStoryId);

  return (
    <>
      <BundleJsonLd bundle={bundle} />

      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { name: "Marlo", href: "/de" },
            { name: "Bundles", href: "/de/bundles" },
            { name: bundle.displayName, href: `/de/bundles/${bundle.bundleSlug}` },
          ]}
        />

        <header className="border-b border-marlo-gold/20 px-6 py-6">
          <Link
            href="/de/bundles"
            className="text-sm text-marlo-dark/60 hover:text-marlo-gold"
          >
            &larr; Alle Bundles
          </Link>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-12">
          <span className="text-xs uppercase tracking-widest text-marlo-gold">
            {bundle.occasion}
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl font-medium leading-tight">
            {bundle.displayName}
          </h1>
          <p className="mt-4 text-lg text-marlo-dark/70 leading-relaxed">
            {bundle.heroDescription}
          </p>

          <div className="mt-8 border border-marlo-gold/20 rounded-lg p-6 bg-white">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-medium">
                  {bundle.priceEur.toLocaleString("de-DE")} €
                </p>
                <p className="text-sm text-marlo-dark/50">
                  inkl. MwSt. · {bundle.durationDays} Tage
                </p>
              </div>
              <Link
                href={`/de/bundles/${bundle.bundleSlug}/buchen`}
                className="inline-block bg-marlo-dark text-white px-6 py-3 rounded hover:bg-marlo-gold transition-colors text-sm font-medium"
              >
                Jetzt buchen
              </Link>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-medium mb-4">Inklusive</h2>
            <ul className="space-y-2">
              {bundle.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-marlo-dark/80">
                  <span className="text-marlo-gold mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {bundle.optionalAddOns && bundle.optionalAddOns.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-medium mb-4">Optionale Extras</h2>
              <ul className="space-y-2">
                {bundle.optionalAddOns.map((addon) => (
                  <li key={addon.name} className="flex items-center justify-between text-marlo-dark/80">
                    <span>{addon.name}</span>
                    <span className="text-sm font-medium">+{addon.priceEur} €</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-medium mb-2">Uhren-Familie</h2>
            <p className="text-marlo-dark/70">{bundle.watchFamily}</p>
            <p className="text-sm text-marlo-dark/50 mt-1">
              Genaues Modell nach Verfügbarkeit — alle aus der {bundle.watchFamily}-Kollektion.
            </p>
          </section>

          {story && (
            <section className="mt-10 border-t border-marlo-gold/20 pt-8">
              <p className="text-xs uppercase tracking-widest text-marlo-gold mb-2">
                Editorial
              </p>
              <Link
                href={`/de/stories/${story.id}`}
                className="text-lg font-medium hover:text-marlo-gold transition-colors"
              >
                {story.title} &rarr;
              </Link>
              <p className="mt-1 text-sm text-marlo-dark/60">{story.excerpt}</p>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
