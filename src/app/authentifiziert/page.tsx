import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NavServer as Nav } from "@/components/nav-server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "marianni Authenticated — Vertrauen als Produkt",
  description:
    "Jede Uhr in unserer Kollektion wird von zertifizierten Uhrmachern inspiziert, authentifiziert und mit NFC-Zertifikat versehen.",
};

export default async function AuthentifiziertPage() {
  const authenticatedCount = await prisma.watchAuthenticity.count({
    where: { status: "VERIFIED" },
  });

  const recentAuthenticated = await prisma.watchAuthenticity.findMany({
    where: { status: "VERIFIED" },
    orderBy: { authenticatedAt: "desc" },
    take: 6,
    include: {
      item: {
        select: { name: true, brand: true, slug: true, images: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-white border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 mb-6"
              style={{ borderColor: "#b08840", color: "#b08840" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-4 tracking-tight">
              marianni Authenticated
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Vertrauen ist kein Versprechen — es ist ein Produkt. Jede Uhr in unserer
              Kollektion durchläuft eine mehrstufige Authentifizierung durch zertifizierte
              Uhrmacher, bevor sie Ihnen zugestellt wird.
            </p>
          </div>
        </section>

        {/* Process steps */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-xs tracking-widest uppercase text-stone-500 text-center mb-12">
            Unser Authentifizierungsprozess
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <ProcessStep
              number="01"
              title="Inspektion"
              description="Zertifizierte Uhrmacher prüfen Gehäuse, Zifferblatt, Werk und
                Krone. Jedes Detail wird dokumentiert."
            />
            <ProcessStep
              number="02"
              title="Videodokumentation"
              description="Ein 60–90-sekündiges Inspektionsvideo dokumentiert den Zustand
                der Uhr — zugänglich über Ihr Authentifizierungszertifikat."
            />
            <ProcessStep
              number="03"
              title="NFC-Zertifikat"
              description="Jede Uhr wird mit einer NFC-Authentifizierungskarte versiegelt.
                Scannen Sie die Karte mit Ihrem Smartphone, um die Echtheit jederzeit zu verifizieren."
            />
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-y border-stone-200">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="inline-block">
              <p className="font-serif text-5xl text-stone-900">{authenticatedCount}</p>
              <p className="text-xs tracking-widest uppercase text-stone-500 mt-2">
                Authentifizierte Uhren
              </p>
            </div>
          </div>
        </section>

        {/* Recently authenticated */}
        {recentAuthenticated.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-xs tracking-widest uppercase text-stone-500 text-center mb-8">
              Kürzlich authentifiziert
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recentAuthenticated.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/catalog/${rec.item.slug}`}
                  className="group border border-stone-200 bg-white overflow-hidden hover:border-stone-300 transition-colors"
                >
                  {rec.item.images[0] && (
                    <div className="aspect-square bg-stone-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={rec.item.images[0]}
                        alt={`${rec.item.brand} ${rec.item.name}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-[10px] tracking-widest uppercase text-stone-500">
                      {rec.item.brand}
                    </p>
                    <p className="text-sm text-stone-900 mt-0.5">{rec.item.name}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full border flex-shrink-0 flex items-center justify-center"
                        style={{ borderColor: "#b08840", color: "#b08840" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2 h-2">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-[10px] tracking-wider uppercase" style={{ color: "#b08840" }}>
                        Authenticated
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Verify CTA */}
        <section className="bg-stone-900 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl mb-4">
              Uhr verifizieren
            </h2>
            <p className="text-stone-400 mb-6 max-w-lg mx-auto">
              Haben Sie eine marianni-Authentifizierungskarte? Scannen Sie den NFC-Chip
              oder geben Sie die Seriennummer ein, um die Echtheit Ihrer Uhr zu überprüfen.
            </p>
            <VerifySearchForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs tracking-wider text-stone-500 uppercase">
          © {new Date().getFullYear()} marianni Luxury Rentals
        </div>
      </footer>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <p className="font-serif text-2xl text-stone-300 mb-3">{number}</p>
      <h3 className="text-sm font-medium tracking-wider uppercase text-stone-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}

function VerifySearchForm() {
  return (
    <form action="/verify" method="get" className="flex gap-2 max-w-md mx-auto">
      <input
        type="text"
        name="serial"
        placeholder="Seriennummer eingeben..."
        className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-stone-500"
        required
      />
      <button
        type="submit"
        className="px-6 py-3 bg-white text-stone-900 text-sm tracking-wider uppercase hover:bg-stone-100 transition-colors"
      >
        Verifizieren
      </button>
    </form>
  );
}
