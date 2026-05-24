import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAuthenticityBySerial,
  getAllAuthenticityRecords,
} from "@/lib/authenticity";
import { getWatchByRef } from "@/lib/watches";
import { BASE_URL } from "@/lib/seo";
import { CertificateQR } from "@/app/components/CertificateQR";
import { InspectionShowcase } from "@/app/components/InspectionShowcase";
import type { WatchConditionGrade } from "@/lib/types";

const CONDITION_LABELS: Record<WatchConditionGrade, string> = {
  "A+": "Neuwertig",
  A: "Sehr gut",
  "B+": "Gut",
  B: "Gut",
};

export function generateStaticParams() {
  return getAllAuthenticityRecords().map((r) => ({ serial: r.serial }));
}

export function generateMetadata({
  params,
}: {
  params: { serial: string };
}): Metadata {
  const record = getAuthenticityBySerial(decodeURIComponent(params.serial));
  if (!record) {
    return {
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `Authentifiziert: ${record.brand} ${record.model} — Marlo`,
    description: `Verifizierter Echtheitszertifikat für ${record.brand} ${record.model} Ref. ${record.referenceNumber}. Zertifikat ${record.certificateNumber}.`,
    openGraph: {
      title: `marianni Authenticated — ${record.brand} ${record.model}`,
      description: `Geprüft von ${record.watchmaker}. Zertifikat ${record.certificateNumber}.`,
      url: `${BASE_URL}/auth/${record.serial}`,
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}

function VerificationJsonLd({
  record,
}: {
  record: NonNullable<ReturnType<typeof getAuthenticityBySerial>>;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${record.brand} ${record.model}`,
    brand: { "@type": "Brand", name: record.brand },
    model: record.model,
    productID: record.serial,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "referenceNumber",
        value: record.referenceNumber,
      },
      {
        "@type": "PropertyValue",
        name: "certificateNumber",
        value: record.certificateNumber,
      },
      {
        "@type": "PropertyValue",
        name: "authenticatedAt",
        value: record.authenticatedAt,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

export default function VerificationPage({
  params,
}: {
  params: { serial: string };
}) {
  const record = getAuthenticityBySerial(decodeURIComponent(params.serial));
  if (!record) notFound();

  const latestCondition = record.conditionLog[record.conditionLog.length - 1];
  const authDate = new Date(record.authenticatedAt);
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://marianni.de"}/auth/${encodeURIComponent(record.serial)}`;
  const watchAssets = getWatchByRef(record.brand, record.referenceNumber);

  return (
    <>
      <VerificationJsonLd record={record} />

      <main className="min-h-screen bg-marlo-cream">
        <header className="border-b border-gold-200 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-medium tracking-widest uppercase text-marlo-dark">
            Marlo
          </Link>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
          {/* Certificate number strip */}
          <div className="text-center mb-6">
            <span className="inline-block text-[11px] font-mono tabular-nums tracking-widest text-stone-400 uppercase">
              {record.certificateNumber}
            </span>
          </div>

          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs uppercase tracking-widest text-gold-700 mb-4">
              Echtheitsprüfung
            </p>
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-300 rounded-full px-4 py-2 mb-6 motion-safe:animate-[fadeSlideIn_0.5s_ease-out]">
              <svg
                className="w-5 h-5 text-gold-700 motion-safe:animate-[shieldPop_0.6s_ease-out_0.2s_both]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-gold-700">Echtheit bestätigt</span>
            </div>
            <p className="text-sm text-stone-500 mb-6">
              Diese Uhr wurde von marianni geprüft und authentifiziert.
            </p>
            <h1 className="text-2xl sm:text-3xl font-medium">
              {record.brand} {record.model}
            </h1>
            <p className="mt-1 text-stone-400 text-sm font-mono tabular-nums">
              Ref. {record.referenceNumber}
            </p>
          </div>

          <div className="space-y-6">
            <section className="bg-white border border-gold-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-xs uppercase tracking-widest text-gold-600 mb-4">
                Zertifikat
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <dl className="flex-1 min-w-0 divide-y divide-stone-100">
                  <div className="flex justify-between py-2.5 first:pt-0">
                    <dt className="text-sm text-stone-500">Zertifikatsnummer</dt>
                    <dd className="text-sm font-medium font-mono tabular-nums">{record.certificateNumber}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-sm text-stone-500">Seriennummer</dt>
                    <dd className="text-sm font-medium font-mono tabular-nums">{record.serial}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-sm text-stone-500">Authentifiziert am</dt>
                    <dd className="text-sm font-medium tabular-nums">
                      {authDate.toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5 last:pb-0">
                    <dt className="text-sm text-stone-500">Uhrmacher</dt>
                    <dd className="text-sm font-medium">{record.watchmaker}</dd>
                  </div>
                </dl>
                <div className="flex justify-center sm:justify-end shrink-0">
                  <CertificateQR
                    url={verifyUrl}
                    label={`QR-Code zur Verifizierung von ${record.brand} ${record.model}`}
                  />
                </div>
              </div>
            </section>

            {latestCondition && (
              <section className="bg-white border border-gold-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xs uppercase tracking-widest text-gold-600 mb-4">
                  Zustandsbericht
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold-100 text-gold-600 font-medium text-sm">
                    {latestCondition.grade}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      Zustand: {CONDITION_LABELS[latestCondition.grade as WatchConditionGrade] ?? latestCondition.grade}
                    </p>
                    <p className="text-xs text-stone-400 tabular-nums">
                      {new Date(latestCondition.date).toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" · "}
                      {latestCondition.inspectedBy}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {latestCondition.notes}
                </p>
              </section>
            )}

            {watchAssets && watchAssets.images360.length > 0 && (
              <section className="bg-white border border-gold-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xs uppercase tracking-widest text-gold-600 mb-4">
                  Inspektionsvideo
                </h2>
                <InspectionShowcase
                  frames={watchAssets.images360}
                  brand={record.brand}
                  model={record.model}
                  referenceNumber={record.referenceNumber}
                  conditionLog={record.conditionLog}
                  watchmaker={record.watchmaker}
                  certificateNumber={record.certificateNumber}
                />
              </section>
            )}

            {/* swap-when-funded: Mux/Cloudflare Stream — replace <video> with Mux Player or Stream embed for adaptive bitrate */}
            {record.inspectionVideoUrl && (
              <section className="bg-white border border-gold-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xs uppercase tracking-widest text-gold-600 mb-4">
                  Inspektionsvideo
                </h2>
                <video
                  controls
                  className="w-full rounded-lg bg-stone-100"
                  preload="metadata"
                >
                  <source src={record.inspectionVideoUrl} />
                </video>
              </section>
            )}

            {/* swap-when-funded: NFC NTAG 424 DNA — replace QR card stub with NFC tap-to-verify using real NTAG 424 DNA cards */}
            {record.nfcUid && (
              <section className="bg-white border border-gold-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xs uppercase tracking-widest text-gold-600 mb-4">
                  NFC-Echtheitskarte
                </h2>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="inline-flex flex-col items-center justify-center w-48 h-28 rounded-lg border-2 border-gold-300 bg-gold-50 text-center p-3 shrink-0">
                    <svg className="w-6 h-6 text-gold-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
                    </svg>
                    <span className="text-[10px] font-medium tracking-widest uppercase text-gold-700">Marlo</span>
                    <span className="text-[9px] text-gold-600 font-mono mt-0.5">
                      {record.nfcUid.slice(0, 4)}…{record.nfcUid.slice(-4)}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Diese Uhr wird mit einer NFC-Echtheitskarte ausgeliefert
                    (UID: {record.nfcUid.slice(0, 4)}…{record.nfcUid.slice(-4)}).
                    Karte mit dem Smartphone scannen, um die Echtheit jederzeit zu überprüfen.
                  </p>
                </div>
              </section>
            )}

            {record.conditionLog.length > 1 && (
              <section className="bg-white border border-gold-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-xs uppercase tracking-widest text-gold-600 mb-4">
                  Zustandsverlauf
                </h2>
                <ul className="space-y-3">
                  {record.conditionLog.map((entry, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold-100 text-gold-700 text-xs font-medium shrink-0 mt-0.5">
                        {entry.grade}
                      </span>
                      <div>
                        <p className="text-stone-500 text-xs tabular-nums">
                          {new Date(entry.date).toLocaleDateString("de-DE")} · {entry.inspectedBy}
                        </p>
                        <p className="text-stone-700">{entry.notes}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="text-center pt-4">
              <Link
                href="/de/bundles"
                className="text-sm font-medium text-gold-700 hover:text-gold-800 transition-colors"
              >
                Diese Uhr in der Kollektion ansehen →
              </Link>
            </section>
          </div>

          <footer className="mt-8 sm:mt-10 text-center text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
            <p>
              Jede Uhr in unserer Kollektion durchläuft eine sorgfältige
              Authentifizierung durch zertifizierte Uhrmacher. Wir prüfen
              Provenienz, Zustand und Werk, bevor eine Uhr in unsere Mietflotte
              aufgenommen wird.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
