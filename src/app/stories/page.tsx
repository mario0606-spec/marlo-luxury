import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { lookbooks } from "@/lib/lookbooks";

export const metadata: Metadata = {
  title: "Stories — Lookbooks für jeden Anlass",
  description:
    "Zehn Occasion-Lookbooks von marianni: Welche Uhr passt zur Hochzeit, zum Business-Dinner, zum ersten Date? Curated watch guides mit Mietempfehlungen.",
};

const occasionColors: Record<string, string> = {
  Hochzeit: "bg-stone-100 text-stone-600",
  Gala: "bg-amber-50 text-amber-800",
  Business: "bg-slate-100 text-slate-600",
  Reise: "bg-sky-50 text-sky-700",
  Silvester: "bg-stone-900 text-gold-400",
  Geburtstag: "bg-rose-50 text-rose-700",
  Date: "bg-pink-50 text-pink-700",
  Urlaub: "bg-cyan-50 text-cyan-700",
  Kultur: "bg-violet-50 text-violet-700",
  Geschenk: "bg-emerald-50 text-emerald-700",
};

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
            Editorial
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C1C1C] tracking-tight mb-6"
            style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
          >
            Stories
          </h1>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Welche Uhr passt zu welchem Moment? Zehn Occasion-Lookbooks — von der
            Hochzeit bis zum Sommermeer. Jede Uhr direkt mietbar.
          </p>
        </div>

        {/* Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lookbooks.map((lb, i) => (
            <Link
              key={lb.slug}
              href={`/stories/${lb.slug}`}
              className="group relative block bg-white border border-stone-200 overflow-hidden hover:border-[#C9A84C] transition-colors duration-300"
            >
              {/* Decorative number */}
              <div className="absolute top-6 right-6 text-6xl font-light text-stone-100 leading-none select-none group-hover:text-[#C9A84C]/10 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="p-8 pt-10 relative z-10">
                {/* Occasion badge */}
                <span
                  className={`inline-block text-[0.6rem] tracking-[0.35em] uppercase px-2 py-0.5 mb-5 ${
                    occasionColors[lb.occasion] ?? "bg-stone-100 text-stone-600"
                  }`}
                >
                  {lb.occasion}
                </span>

                <h2
                  className="text-xl sm:text-2xl font-light text-[#1C1C1C] mb-3 leading-snug group-hover:text-[#C9A84C] transition-colors"
                  style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
                >
                  {lb.title}
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {lb.subtitle}
                </p>

                {/* Watch count */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 text-xs tracking-wider">
                    {lb.watches.length} Uhren
                  </span>
                  <span className="text-[#C9A84C] text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Entdecken →
                  </span>
                </div>

                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A84C] group-hover:w-full transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1C1C1C]">
        <div className="max-w-2xl mx-auto text-center px-4">
          <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
            Für jeden Moment
          </p>
          <h2
            className="text-3xl sm:text-4xl font-light text-white mb-6"
            style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif" }}
          >
            Trage den Moment.
          </h2>
          <p className="text-stone-400 text-base mb-10 leading-relaxed">
            Kein Kauf. Keine Verpflichtung. Nur die richtige Uhr für den richtigen Anlass —
            geliefert bis zur Haustür.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center bg-[#C9A84C] hover:bg-[#b8933f] text-[#1C1C1C] px-10 py-4 text-sm font-medium tracking-widest uppercase transition-colors"
          >
            Kollektion entdecken
          </Link>
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
