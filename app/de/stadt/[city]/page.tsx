import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cityLandings, getCityBySlug } from "@/lib/cities";
import { occasionBundles } from "@/lib/bundles";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { BASE_URL, hreflangAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return cityLandings.map((c) => ({ city: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { city: string };
}): Metadata {
  const city = getCityBySlug(params.city);
  if (!city) return {};
  const path = `/de/stadt/${city.slug}`;
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: hreflangAlternates(path),
  };
}

function CityJsonLd({ city }: { city: NonNullable<ReturnType<typeof getCityBySlug>> }) {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Marlo Luxusuhr-Vermietung",
    description: city.metaDescription,
    provider: {
      "@type": "Organization",
      name: "Marlo Luxury Rentals",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: {
        "@type": "Country",
        name:
          city.country === "DE"
            ? "Deutschland"
            : city.country === "AT"
              ? "Österreich"
              : "Schweiz",
      },
    },
    serviceType: "Luxusuhr Vermietung",
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faq.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </>
  );
}

export default function CityLandingPage({
  params,
}: {
  params: { city: string };
}) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const relevantBundles = occasionBundles.filter((b) =>
    city.occasions.includes(b.occasion),
  );

  return (
    <>
      <CityJsonLd city={city} />

      <main className="min-h-screen">
        <Breadcrumbs
          items={[
            { name: "Marlo", href: "/de" },
            { name: "Städte", href: "/de/stadt" },
            { name: city.name, href: `/de/stadt/${city.slug}` },
          ]}
        />

        <header className="border-b border-marlo-gold/20 px-6 py-8 text-center">
          <h1 className="text-3xl md:text-4xl tracking-tight">{city.headline}</h1>
          <p className="mt-4 text-lg text-marlo-dark/70 max-w-2xl mx-auto leading-relaxed">
            {city.intro}
          </p>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-xl font-medium mb-6">
            Occasion Bundles in {city.name}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relevantBundles.map((bundle) => (
              <Link
                key={bundle.bundleSlug}
                href={`/de/bundles/${bundle.bundleSlug}`}
                className="group block border border-marlo-gold/20 rounded-lg p-6 hover:border-marlo-gold transition-colors bg-white"
              >
                <span className="text-xs uppercase tracking-widest text-marlo-gold">
                  {bundle.occasion}
                </span>
                <h3 className="mt-2 text-lg font-medium leading-tight group-hover:text-marlo-gold transition-colors">
                  {bundle.displayName}
                </h3>
                <p className="mt-3 text-sm text-marlo-dark/60">
                  {bundle.durationDays} Tage · {bundle.watchFamily}
                </p>
                <p className="mt-4 text-2xl font-medium">
                  {bundle.priceEur.toLocaleString("de-DE")} €
                </p>
                <p className="text-xs text-marlo-dark/50 mt-1">inkl. MwSt.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-12 border-t border-marlo-gold/20">
          <h2 className="text-xl font-medium mb-6">
            Häufige Fragen — {city.name}
          </h2>
          <dl className="space-y-6">
            {city.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-medium">{item.question}</dt>
                <dd className="mt-2 text-marlo-dark/70 leading-relaxed">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}
