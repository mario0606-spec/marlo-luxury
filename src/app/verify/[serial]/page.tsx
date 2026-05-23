import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ serial: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serial } = await params;
  const decoded = decodeURIComponent(serial);
  const record = await prisma.watchAuthenticity.findUnique({
    where: { serialNumber: decoded },
    include: { item: { select: { name: true, brand: true } } },
  });
  if (!record) return { title: "Verification — Not Found" };
  return {
    title: `Verified: ${record.item.brand} ${record.item.name}`,
    description: `This ${record.item.brand} ${record.item.name} has been authenticated and verified by marianni.`,
  };
}

export default async function VerifyPage({ params }: PageProps) {
  const { serial } = await params;
  const decoded = decodeURIComponent(serial);

  const record = await prisma.watchAuthenticity.findUnique({
    where: { serialNumber: decoded },
    include: {
      item: {
        select: {
          name: true,
          brand: true,
          model: true,
          referenceNumber: true,
          images: true,
          slug: true,
          condition: true,
        },
      },
    },
  });

  if (!record || record.status === "REVOKED") notFound();

  const isVerified = record.status === "VERIFIED";
  const authDate = record.authenticatedAt.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-wide text-stone-900">
            marianni
          </Link>
          <span className="text-xs tracking-widest uppercase text-stone-500">
            Authenticity Verification
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Status banner */}
        <div
          className={`flex items-center gap-4 p-6 mb-8 border ${
            isVerified
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div
            className={`shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
              isVerified
                ? "border-emerald-600 text-emerald-700"
                : "border-amber-600 text-amber-700"
            }`}
          >
            {isVerified ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-stone-900">
              {isVerified ? "Authenticity Verified" : "Verification Pending"}
            </p>
            <p className="text-sm text-stone-600 mt-0.5">
              {isVerified
                ? "This timepiece has been inspected and authenticated by marianni."
                : "This timepiece is currently undergoing authentication."}
            </p>
          </div>
        </div>

        {/* Watch details */}
        <div className="bg-white border border-stone-200 overflow-hidden">
          {record.item.images[0] && (
            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center overflow-hidden">
              <img
                src={record.item.images[0]}
                alt={`${record.item.brand} ${record.item.name}`}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="p-6">
            <p className="text-xs tracking-widest uppercase text-stone-500 mb-1">
              {record.item.brand}
            </p>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 mb-4">
              {record.item.name}
            </h1>

            <dl className="space-y-3 text-sm">
              <DetailRow label="Serial Number" value={record.serialNumber} />
              {record.item.model && (
                <DetailRow label="Model" value={record.item.model} />
              )}
              {record.item.referenceNumber && (
                <DetailRow label="Reference" value={record.item.referenceNumber} />
              )}
              <DetailRow label="Authenticated By" value={record.authenticatedBy} />
              <DetailRow label="Watchmaker" value={record.watchmaker} />
              <DetailRow label="Date of Authentication" value={authDate} />
              {record.item.condition && (
                <DetailRow
                  label="Condition"
                  value={
                    record.item.condition === "MINT"
                      ? "Mint"
                      : record.item.condition === "VERY_GOOD"
                      ? "Very Good"
                      : "Good"
                  }
                />
              )}
              {record.conditionNotes && (
                <DetailRow label="Condition Notes" value={record.conditionNotes} />
              )}
            </dl>
          </div>

          {/* Inspection video */}
          {record.inspectionVideoUrl && (
            <div className="border-t border-stone-200 p-6">
              <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">
                Inspection Video
              </h2>
              <div className="aspect-video bg-stone-900 rounded overflow-hidden">
                <video
                  src={record.inspectionVideoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                  poster={record.item.images[0] ?? undefined}
                />
              </div>
            </div>
          )}

          {/* NFC info */}
          {record.nfcUid && (
            <div className="border-t border-stone-200 p-6">
              <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-2">
                NFC Authenticity Card
              </h2>
              <p className="text-sm text-stone-600">
                This watch ships with an NFC authenticity card (UID: {record.nfcUid.slice(0, 4)}…{record.nfcUid.slice(-4)}).
                Tap the card with your phone to verify at any time.
              </p>
            </div>
          )}
        </div>

        {/* Link to rent */}
        <div className="mt-8 text-center">
          <Link
            href={`/catalog/${record.item.slug}`}
            className="inline-block text-sm tracking-wider uppercase text-stone-600 hover:text-stone-900 border-b border-stone-300 pb-0.5"
          >
            View this piece in our collection →
          </Link>
        </div>

        {/* Trust footer */}
        <div className="mt-12 pt-8 border-t border-stone-200 text-center">
          <p className="font-serif text-lg text-stone-900 mb-2">marianni Authenticated</p>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Every timepiece in our collection undergoes rigorous authentication by certified
            horologists. We verify provenance, condition, and mechanical integrity before
            any piece enters our rental fleet.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-2xl mx-auto px-4 text-center text-xs tracking-wider text-stone-500 uppercase">
          © {new Date().getFullYear()} marianni Luxury Rentals
        </div>
      </footer>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-500 shrink-0">{label}</dt>
      <dd className="text-stone-900 text-right">{value}</dd>
    </div>
  );
}
