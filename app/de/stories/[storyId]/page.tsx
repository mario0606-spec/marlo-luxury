import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { editorialStories, getStoryById, getRelatedStories } from "@/lib/stories";
import { getBundleBySlug } from "@/lib/bundles";
import type { OccasionBundle, StoryContentBlock } from "@/lib/types";
import { StickyCta } from "./sticky-cta";

export function generateStaticParams() {
  return editorialStories.map((s) => ({ storyId: s.id }));
}

export function generateMetadata({
  params,
}: {
  params: { storyId: string };
}): Metadata {
  const story = getStoryById(params.storyId);
  if (!story) return {};
  return {
    title: `${story.title} — Marlo`,
    description: story.excerpt,
  };
}

function InlineWatchCta({ bundle }: { bundle: OccasionBundle }) {
  return (
    <div className="my-8 border border-marlo-gold/30 rounded-lg bg-white p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-marlo-gold mb-1">
            Diese Uhr mieten
          </p>
          <p className="font-medium text-lg">{bundle.displayName}</p>
          <p className="text-sm text-marlo-dark/60 mt-1">
            {bundle.durationDays} Tage · {bundle.watchFamily} · ab{" "}
            {bundle.priceEur.toLocaleString("de-DE")} €
          </p>
        </div>
        <Link
          href={`/de/bundles/${bundle.bundleSlug}/buchen`}
          className="shrink-0 inline-block bg-marlo-dark text-white px-6 py-3 rounded hover:bg-marlo-gold transition-colors text-sm font-medium text-center"
        >
          Jetzt buchen
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {bundle.includes.slice(0, 3).map((item) => (
          <span key={item} className="text-xs text-marlo-dark/50 flex items-center gap-1">
            <span className="text-marlo-gold">&#10003;</span> {item}
          </span>
        ))}
      </div>
      <Link
        href={`/de/bundles/${bundle.bundleSlug}`}
        className="inline-block mt-3 text-xs text-marlo-gold hover:underline"
      >
        Alle Details &rarr;
      </Link>
    </div>
  );
}

function BundleHeroCard({ bundle }: { bundle: OccasionBundle }) {
  return (
    <div className="my-10 rounded-xl bg-gradient-to-br from-marlo-dark to-marlo-dark/90 text-white p-6 md:p-8">
      <p className="text-xs uppercase tracking-widest text-marlo-gold mb-2">
        Occasion Bundle
      </p>
      <h3 className="text-2xl md:text-3xl font-medium leading-tight">
        {bundle.displayName}
      </h3>
      <p className="mt-3 text-white/70 leading-relaxed max-w-xl">
        {bundle.heroDescription}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-4">
        <div>
          <p className="text-3xl font-medium">
            {bundle.priceEur.toLocaleString("de-DE")} €
          </p>
          <p className="text-sm text-white/50">
            inkl. MwSt. · {bundle.durationDays} Tage · alles inklusive
          </p>
        </div>
        <Link
          href={`/de/bundles/${bundle.bundleSlug}/buchen`}
          className="inline-block bg-marlo-gold text-marlo-dark px-6 py-3 rounded hover:bg-marlo-gold/90 transition-colors text-sm font-medium text-center"
        >
          Bundle buchen
        </Link>
      </div>
    </div>
  );
}

function ContentBlock({
  block,
  bundles,
}: {
  block: StoryContentBlock;
  bundles: Map<string, OccasionBundle>;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="mt-6 text-lg text-marlo-dark/80 leading-relaxed">
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h2 className="mt-10 text-xl md:text-2xl font-medium">{block.text}</h2>
      );
    case "watch_cta": {
      const bundle = bundles.get(block.bundleSlug);
      if (!bundle) return null;
      return <InlineWatchCta bundle={bundle} />;
    }
    case "image":
      return (
        <figure className="my-8">
          <div className="aspect-[16/9] bg-marlo-dark/5 rounded-lg flex items-center justify-center">
            <span className="text-sm text-marlo-dark/30">{block.alt}</span>
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-sm text-marlo-dark/50 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
  }
}

function ArticleJsonLd({
  story,
  primaryBundle,
}: {
  story: NonNullable<ReturnType<typeof getStoryById>>;
  primaryBundle: OccasionBundle | undefined;
}) {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    author: { "@type": "Organization", name: story.author },
    datePublished: story.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "Marlo Luxury Rentals",
    },
  };

  const productLd = primaryBundle
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: primaryBundle.displayName,
        description: primaryBundle.heroDescription,
        brand: { "@type": "Brand", name: primaryBundle.watchFamily },
        offers: {
          "@type": "Offer",
          price: primaryBundle.priceEur,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {productLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      )}
    </>
  );
}

export default function StoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  const story = getStoryById(params.storyId);
  if (!story) notFound();

  const bundleMap = new Map(
    story.bundleSlugs
      .map((slug) => [slug, getBundleBySlug(slug)] as const)
      .filter((entry): entry is [string, OccasionBundle] => !!entry[1]),
  );
  const primaryBundle = bundleMap.values().next().value as OccasionBundle | undefined;
  const relatedStories = getRelatedStories(story.id, 3);
  const bundleInsertIndex = Math.floor(story.contentBlocks.length / 2);

  return (
    <>
      <ArticleJsonLd story={story} primaryBundle={primaryBundle} />

      <main className="min-h-screen pb-20 md:pb-0">
        <header className="border-b border-marlo-gold/20 px-6 py-6">
          <Link
            href="/de/bundles"
            className="text-sm text-marlo-dark/60 hover:text-marlo-gold"
          >
            &larr; Zurück
          </Link>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-marlo-gold">
              <span>Editorial</span>
              <span className="text-marlo-dark/20">·</span>
              <span>{story.occasion}</span>
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
              {story.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-marlo-dark/60 leading-relaxed">
              {story.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-marlo-dark/40">
              <span>{story.author}</span>
              <span>·</span>
              <time dateTime={story.publishedAt}>
                {new Date(story.publishedAt).toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
          </div>

          <div className="aspect-[2/1] bg-marlo-dark/5 rounded-lg flex items-center justify-center mb-8">
            <span className="text-sm text-marlo-dark/30">
              {story.heroImageAlt}
            </span>
          </div>

          {story.contentBlocks.map((block, i) => (
            <div key={i}>
              <ContentBlock block={block} bundles={bundleMap} />
              {i === bundleInsertIndex && primaryBundle && (
                <BundleHeroCard bundle={primaryBundle} />
              )}
            </div>
          ))}

          {relatedStories.length > 0 && (
            <section className="mt-16 border-t border-marlo-gold/20 pt-10">
              <h2 className="text-lg font-medium mb-6">Weiterlesen</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedStories.map((related) => {
                  const relatedBundle = related.bundleSlugs[0]
                    ? getBundleBySlug(related.bundleSlugs[0])
                    : undefined;
                  return (
                    <Link
                      key={related.id}
                      href={`/de/stories/${related.id}`}
                      className="group block border border-marlo-gold/20 rounded-lg p-5 bg-white hover:border-marlo-gold transition-colors"
                    >
                      <span className="text-xs uppercase tracking-widest text-marlo-gold">
                        {related.occasion}
                      </span>
                      <h3 className="mt-2 font-medium leading-snug group-hover:text-marlo-gold transition-colors">
                        {related.title}
                      </h3>
                      <p className="mt-2 text-sm text-marlo-dark/60 line-clamp-2">
                        {related.excerpt}
                      </p>
                      {relatedBundle && (
                        <p className="mt-3 text-xs text-marlo-gold">
                          ab {relatedBundle.priceEur.toLocaleString("de-DE")} €
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </main>

      {primaryBundle && (
        <StickyCta
          bundleSlug={primaryBundle.bundleSlug}
          displayName={primaryBundle.displayName}
          priceEur={primaryBundle.priceEur}
        />
      )}
    </>
  );
}
