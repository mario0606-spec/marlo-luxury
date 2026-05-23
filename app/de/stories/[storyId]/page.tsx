import Link from "next/link";
import { notFound } from "next/navigation";
import { editorialStories, getStoryById } from "@/lib/stories";
import { getBundleBySlug } from "@/lib/bundles";

export function generateStaticParams() {
  return editorialStories.map((s) => ({ storyId: s.id }));
}

export default function StoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  const story = getStoryById(params.storyId);
  if (!story) notFound();

  const linkedBundles = story.bundleSlugs
    .map(getBundleBySlug)
    .filter(Boolean);

  return (
    <main className="min-h-screen">
      <header className="border-b border-marlo-gold/20 px-6 py-6">
        <Link
          href="/de/bundles"
          className="text-sm text-marlo-dark/60 hover:text-marlo-gold"
        >
          &larr; Bundles
        </Link>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <span className="text-xs uppercase tracking-widest text-marlo-gold">
          Editorial
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-medium leading-tight">
          {story.title}
        </h1>
        <p className="mt-6 text-lg text-marlo-dark/70 leading-relaxed">
          {story.excerpt}
        </p>

        <p className="mt-6 text-marlo-dark/60 leading-relaxed">
          Hier würde der vollständige redaktionelle Beitrag erscheinen — mit
          Bildern, Styling-Tipps und persönlichen Geschichten rund um den Anlass.
          Die Verknüpfung zum Bundle erfolgt über das Feld{" "}
          <code className="text-xs bg-marlo-dark/5 px-1.5 py-0.5 rounded">
            editorialAnchorStoryId
          </code>
          .
        </p>

        {linkedBundles.length > 0 && (
          <section className="mt-10 border-t border-marlo-gold/20 pt-8">
            <h2 className="text-lg font-medium mb-4">Diese Uhr mieten</h2>
            <div className="space-y-4">
              {linkedBundles.map((bundle) => bundle && (
                <Link
                  key={bundle.bundleSlug}
                  href={`/de/bundles/${bundle.bundleSlug}`}
                  className="block border border-marlo-gold/20 rounded-lg p-5 bg-white hover:border-marlo-gold transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{bundle.displayName}</p>
                      <p className="text-sm text-marlo-dark/60 mt-1">
                        {bundle.durationDays} Tage · {bundle.watchFamily}
                      </p>
                    </div>
                    <p className="text-xl font-medium">
                      {bundle.priceEur.toLocaleString("de-DE")} €
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
