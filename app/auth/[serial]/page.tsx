import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAuthenticityBySerial,
  getAllAuthenticityRecords,
} from "@/lib/authenticity";
import { BASE_URL } from "@/lib/seo";
import { CertificateQR } from "@/app/components/CertificateQR";

export function generateStaticParams() {
  return getAllAuthenticityRecords().map((r) => ({ serial: r.serial }));
}

export function generateMetadata({
  params,
}: {
  params: { serial: string };
}): Metadata {
  const record = getAuthenticityBySerial(decodeURIComponent(params.serial));
  if (!record) return {};
  return {
    title: `Authentifiziert: ${record.brand} ${record.model} — Marlo`,
    description: `Verifizierter Echtheitszertifikat für ${record.brand} ${record.model} Ref. ${record.referenceNumber}. Zertifikat ${record.certificateNumber}.`,
    openGraph: {
      title: `Marlo Authenticated — ${record.brand} ${record.model}`,
      description: `Verified by ${record.watchmaker}. Certificate ${record.certificateNumber}.`,
      url: `${BASE_URL}/auth/${record.serial}`,
      type: "website",
    },
    robots: { index: false },
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
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://marianni.de"}/verify/${encodeURIComponent(record.serial)}`;

  return (
    <>
      <VerificationJsonLd record={record} />

      <main className="min-h-screen bg-marlo-cream">
        <header className="border-b border-marlo-gold/20 px-6 py-4">
          <Link href="/" className="text-sm font-medium tracking-widest uppercase text-marlo-dark">
            Marlo
          </Link>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-emerald-800">Echtheit verifiziert</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-medium">
              {record.brand} {record.model}
            </h1>
            <p className="mt-1 text-marlo-dark/50 text-sm">
              Ref. {record.referenceNumber}
            </p>
          </div>

          <div className="space-y-6">
            <section className="bg-white border border-marlo-gold/20 rounded-lg p-6">
              <h2 className="text-xs uppercase tracking-widest text-marlo-gold mb-4">
                Zertifikat
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <dl className="space-y-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <dt className="text-sm text-marlo-dark/60">Zertifikatsnummer</dt>
                    <dd className="text-sm font-medium font-mono">{record.certificateNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-marlo-dark/60">Seriennummer</dt>
                    <dd className="text-sm font-medium font-mono">{record.serial}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-marlo-dark/60">Authentifiziert am</dt>
                    <dd className="text-sm font-medium">
                      {authDate.toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-marlo-dark/60">Uhrmacher</dt>
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
              <section className="bg-white border border-marlo-gold/20 rounded-lg p-6">
                <h2 className="text-xs uppercase tracking-widest text-marlo-gold mb-4">
                  Zustandsbericht
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-marlo-gold/10 text-marlo-gold font-medium text-sm">
                    {latestCondition.grade}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      Zustand {latestCondition.grade}
                    </p>
                    <p className="text-xs text-marlo-dark/50">
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
                <p className="text-sm text-marlo-dark/70 leading-relaxed">
                  {latestCondition.notes}
                </p>
              </section>
            )}

            {record.inspectionVideoUrl && (
              <section className="bg-white border border-marlo-gold/20 rounded-lg p-6">
                <h2 className="text-xs uppercase tracking-widest text-marlo-gold mb-4">
                  Inspektionsvideo
                </h2>
                <a
                  href={record.inspectionVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-marlo-dark hover:text-marlo-gold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Inspektionsvideo ansehen
                </a>
              </section>
            )}

            {record.conditionLog.length > 1 && (
              <section className="bg-white border border-marlo-gold/20 rounded-lg p-6">
                <h2 className="text-xs uppercase tracking-widest text-marlo-gold mb-4">
                  Zustandsverlauf
                </h2>
                <ul className="space-y-3">
                  {record.conditionLog.map((entry, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-marlo-gold/10 text-marlo-gold text-xs font-medium shrink-0 mt-0.5">
                        {entry.grade}
                      </span>
                      <div>
                        <p className="text-marlo-dark/60 text-xs">
                          {new Date(entry.date).toLocaleDateString("de-DE")} · {entry.inspectedBy}
                        </p>
                        <p className="text-marlo-dark/80">{entry.notes}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <footer className="mt-10 text-center text-xs text-marlo-dark/40">
            <p>Dieses Zertifikat wird von Marlo ausgestellt und kann jederzeit unter dieser URL verifiziert werden.</p>
          </footer>
        </div>
      </main>
    </>
  );
}
