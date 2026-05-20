import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { lookbooks, getLookbook } from "@/lib/lookbooks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return lookbooks.map((lb) => ({ slug: lb.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lb = getLookbook(slug);
  if (!lb) return { title: "Not Found" };
  return {
    title: `${lb.title} — marianni Lookbook`,
    description: lb.subtitle,
  };
}

export default async function LookbookPage({ params }: PageProps) {
  const { slug } = await params;
  const lb = getLookbook(slug);
  if (!lb) notFound();

  const currentIndex = lookbooks.findIndex((l) => l.slug === slug);
  const prev = currentIndex > 0 ? lookbooks[currentIndex - 1] : null;
  const next = currentIndex < lookbooks.length - 1 ? lookbooks[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800/70 to-stone-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-stone-500 text-xs tracking-wider mb-12" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/stories" className="hover:text-stone-300 transition-colors">Stories</Link>
            <span>/</span>
            <span className="text-stone-400">{lb.occasion}</span>
          </nav>

          <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
            Lookbook {String(currentIndex + 1).padStart(2, "0")} — {lb.occasion}
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
          >
            {lb.title}
          </h1>
          <p className="text-stone-300/80 text-xl font-light leading-relaxed max-w-2xl">
            {lb.subtitle}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {lb.intro.split("\n\n").map((para, i) => (
          <p
            key={i}
            className={`text-stone-600 leading-relaxed mb-6 ${
              i === 0 ? "text-xl font-light" : "text-base"
            }`}
          >
            {para}
          </p>
        ))}
        <div className="w-12 h-px bg-[#C9A84C] mt-10" />
      </section>

      {/* Watch Cards */}
      <section className="pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {lb.watches.map((watch, i) => (
            <article
              key={watch.slug}
              className="bg-white border border-stone-200 p-8 sm:p-10 hover:border-[#C9A84C] transition-colors duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <span className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase block mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="text-xl sm:text-2xl font-light text-[#1C1C1C] leading-snug"
                    style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
                  >
                    {watch.name}
                  </h2>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[#C9A84C] text-sm font-light">{watch.price}</span>
                </div>
              </div>

              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                {watch.description}
              </p>

              <Link
                href={`/watches/${watch.slug}`}
                className="inline-flex items-center gap-2 bg-[#1C1C1C] hover:bg-[#C9A84C] text-white hover:text-[#1C1C1C] px-6 py-3 text-xs tracking-widest uppercase transition-colors duration-200"
              >
                Jetzt mieten
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        {/* Styling Tip */}
        {lb.stylingTip && (
          <div className="mt-10 border-l-2 border-[#C9A84C] pl-6 py-4 bg-white">
            <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-2">
              Styling-Tipp
            </p>
            <p className="text-stone-600 text-sm leading-relaxed italic">
              {lb.stylingTip}
            </p>
          </div>
        )}
      </section>

      {/* Prev / Next */}
      <section className="border-t border-stone-200 bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
          <div>
            {prev && (
              <Link
                href={`/stories/${prev.slug}`}
                className="group flex flex-col"
              >
                <span className="text-stone-400 text-[0.6rem] tracking-[0.35em] uppercase mb-1">
                  ← Vorheriges Lookbook
                </span>
                <span className="text-stone-900 text-sm group-hover:text-[#C9A84C] transition-colors">
                  {prev.title}
                </span>
              </Link>
            )}
          </div>
          <Link
            href="/stories"
            className="text-stone-400 hover:text-[#C9A84C] text-xs tracking-widest uppercase transition-colors"
          >
            Alle Stories
          </Link>
          <div className="text-right">
            {next && (
              <Link
                href={`/stories/${next.slug}`}
                className="group flex flex-col items-end"
              >
                <span className="text-stone-400 text-[0.6rem] tracking-[0.35em] uppercase mb-1">
                  Nächstes Lookbook →
                </span>
                <span className="text-stone-900 text-sm group-hover:text-[#C9A84C] transition-colors">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-stone-600 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} marianni Luxury Rentals. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </footer>
    </main>
  );
}
