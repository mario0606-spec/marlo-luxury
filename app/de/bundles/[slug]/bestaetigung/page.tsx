import Link from "next/link";
import { notFound } from "next/navigation";
import { getBundleBySlug } from "@/lib/bundles";

export default function ConfirmationPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { buchung?: string };
}) {
  const bundle = getBundleBySlug(params.slug);
  if (!bundle) notFound();

  const bookingId = searchParams.buchung || "—";

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">&#10003;</div>
        <h1 className="text-2xl font-medium">Buchung bestätigt</h1>
        <p className="mt-3 text-marlo-dark/70">
          Vielen Dank für Ihre Buchung. Wir haben Ihnen eine Bestätigungs-E-Mail gesendet.
        </p>

        <div className="mt-8 border border-marlo-gold/20 rounded-lg p-6 bg-white text-left">
          <h2 className="font-medium mb-3">{bundle.displayName}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-marlo-dark/60">Buchungsnummer</dt>
              <dd className="font-mono text-xs">{bookingId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-marlo-dark/60">Dauer</dt>
              <dd>{bundle.durationDays} Tage</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-marlo-dark/60">Betrag</dt>
              <dd className="font-medium">{bundle.priceEur.toLocaleString("de-DE")} €</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-sm text-marlo-dark/60">
            Unser Concierge meldet sich innerhalb von 24 Stunden bei Ihnen, um die Übergabe zu koordinieren.
          </p>
          <Link
            href="/de/bundles"
            className="inline-block text-sm text-marlo-gold hover:underline"
          >
            Weitere Bundles entdecken
          </Link>
        </div>
      </div>
    </main>
  );
}
