import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllAuthenticityRecords } from "@/lib/authenticity";
import { BASE_URL, hreflangAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "marianni Authenticated — Marlo",
  description:
    "Jede Uhr in unserer Kollektion wird von zertifizierten Uhrmachern geprüft und authentifiziert. Echtheit, Zustand und Provenienz — garantiert.",
  alternates: hreflangAlternates("/authentifiziert"),
  openGraph: {
    title: "marianni Authenticated — Marlo",
    description:
      "Jede Uhr in unserer Kollektion wird von zertifizierten Uhrmachern geprüft und authentifiziert.",
    url: `${BASE_URL}/authentifiziert`,
    type: "website",
  },
};

function AuthenticatedJsonLd({ count }: { count: number }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "marianni Authenticated",
    description:
      "Authentifizierungsprogramm für Luxusuhren bei Marlo. Jede Uhr wird von zertifizierten Uhrmachern geprüft.",
    url: `${BASE_URL}/authentifiziert`,
    publisher: {
      "@type": "Organization",
      name: "Marlo",
      url: BASE_URL,
    },
    mainEntity: {
      "@type": "Service",
      name: "marianni Authenticated",
      description: `${count} Uhren authentifiziert. Provenienz, Zustand und Werk geprüft.`,
      provider: { "@type": "Organization", name: "Marlo" },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

function NfcCardSvg() {
  return (
    <div className="inline-flex flex-col items-center justify-center w-32 h-20 rounded-lg border-2 border-gold-300 bg-gold-50 text-center p-2">
      <svg
        className="w-5 h-5 text-gold-600 mb-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0"
        />
      </svg>
      <span className="text-[9px] font-medium tracking-widest uppercase text-gold-700">
        Marlo
      </span>
      <span className="text-[8px] text-gold-500 font-mono mt-0.5">
        NFC · XXXX…XXXX
      </span>
    </div>
  );
}

export default function AuthentifiziertPage() {
  const records = getAllAuthenticityRecords();
  const authenticatedCount = records.length;

  return (
    <>
      <AuthenticatedJsonLd count={authenticatedCount} />

      <main className="min-h-screen bg-marlo-cream">
        <header className="border-b border-gold-200 px-6 py-4">
          <Link
            href="/"
            className="text-sm font-medium tracking-widest uppercase text-marlo-dark"
          >
            Marlo
          </Link>
        </header>

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="text-xs uppercase tracking-widest text-gold-700 mb-4">
            marianni Authenticated
          </p>
          <h1 className="text-3xl md:text-4xl font-medium leading-tight">
            Echtheit, die man spürt
          </h1>
          <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
            Jede Uhr in unserer Kollektion wird von zertifizierten Uhrmachern
            geprüft und authentifiziert. Wir prüfen Provenienz, Zustand und
            Werk, bevor eine Uhr in unsere Mietflotte aufgenommen wird.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/de/bundles"
              className="inline-block bg-stone-900 text-white px-6 py-3 rounded text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Kollektion entdecken
            </Link>
            <a
              href="#verifizieren"
              className="text-sm font-medium text-stone-900 underline underline-offset-4 hover:text-gold-700 transition-colors"
            >
              Uhr verifizieren
            </a>
          </div>
        </section>

        {/* Process */}
        <section className="bg-white border-y border-gold-200">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <p className="text-xs uppercase tracking-widest text-gold-700 mb-2 text-center">
              Prozess
            </p>
            <h2 className="text-2xl font-medium text-center mb-12">
              So authentifizieren wir
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-lg font-medium mb-4">
                  1
                </div>
                <h3 className="font-medium mb-2">Provenienz prüfen</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Herkunft, Kaufbelege und Seriennummer werden gegen
                  Herstellerdatenbanken abgeglichen.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-lg font-medium mb-4">
                  2
                </div>
                <h3 className="font-medium mb-2">Werk & Zustand</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Unsere Uhrmacher inspizieren Werk, Gehäuse und Band. Jede
                  Inspektion wird per Video dokumentiert.
                </p>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center mb-4">
                  <NfcCardSvg />
                </div>
                <h3 className="font-medium mb-2">NFC-Zertifikat</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Jede authentifizierte Uhr erhält eine NFC-Echtheitskarte.
                  Smartphone scannen — Echtheit sofort bestätigt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Im Atelier — watchmaker story (placeholder) */}
        {/* TODO: pair with CMO for final editorial copy and portrait photography */}
        <section className="bg-stone-100">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="aspect-[4/5] bg-stone-200 rounded-lg flex items-center justify-center">
                <span className="text-sm text-stone-400">
                  Porträt-Platzhalter
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gold-700 mb-2">
                  Im Atelier
                </p>
                <h2 className="text-2xl font-medium mb-4">
                  Max Mustermann, Uhrmachermeister
                </h2>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Mit über 15 Jahren Erfahrung und einer WOSTEP-Zertifizierung
                  prüft unser leitender Uhrmacher jede Uhr, die in unsere
                  Kollektion aufgenommen wird. Präzision ist kein Schlagwort —
                  es ist Handwerk.
                </p>
                <blockquote className="border-l-2 border-gold-300 pl-4 italic text-stone-500">
                  &bdquo;Eine Uhr erzählt ihre Geschichte durch ihr Werk. Man
                  muss nur genau hinhören.&ldquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-y border-gold-200">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-medium text-gold-700">
                  {authenticatedCount}
                </p>
                <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">
                  Authentifizierte Uhren
                </p>
              </div>
              <div>
                <p className="text-3xl font-medium text-gold-700">3</p>
                <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">
                  Uhrmacher im Atelier
                </p>
              </div>
              <div>
                <p className="text-3xl font-medium text-gold-700">2024</p>
                <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">
                  Seit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recently authenticated */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-xs uppercase tracking-widest text-gold-700 mb-2 text-center">
            Zuletzt authentifiziert
          </p>
          <h2 className="text-2xl font-medium text-center mb-10">
            Unsere neuesten Zertifikate
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <Link
                key={record.id}
                href={`/auth/${record.serial}`}
                className="group block border border-gold-200 rounded-lg p-5 bg-white hover:border-gold-400 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <svg
                    className="w-2.5 h-2.5 text-gold-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-[11px] tracking-[0.16em] font-medium text-gold-700 uppercase">
                    Authentifiziert
                  </span>
                </div>
                <h3 className="font-medium group-hover:text-gold-700 transition-colors">
                  {record.brand} {record.model}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Ref. {record.referenceNumber}
                </p>
                <p className="text-xs text-stone-400 mt-0.5 tabular-nums">
                  {new Date(record.authenticatedAt).toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Verify form */}
        <section
          id="verifizieren"
          className="bg-stone-100 border-t border-gold-200"
        >
          <div className="max-w-xl mx-auto px-6 py-16 text-center">
            <p className="text-xs uppercase tracking-widest text-gold-700 mb-2">
              Verifizierung
            </p>
            <h2 className="text-2xl font-medium mb-4">
              Uhr verifizieren
            </h2>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Geben Sie die Seriennummer Ihrer Uhr ein oder scannen Sie die
              NFC-Karte, um die Echtheit zu überprüfen.
            </p>
            <form
              action="/auth"
              method="get"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="text"
                name="serial"
                placeholder="Seriennummer eingeben"
                required
                className="flex-1 border border-gold-200 rounded px-4 py-3 text-sm bg-white placeholder:text-stone-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
              />
              <button
                type="submit"
                className="bg-stone-900 text-white px-6 py-3 rounded text-sm font-medium hover:bg-stone-800 transition-colors min-h-[48px]"
              >
                Prüfen
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gold-200 px-6 py-8 text-center">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} Marlo · Luxus-Uhren mieten
          </p>
        </footer>
      </main>
    </>
  );
}
