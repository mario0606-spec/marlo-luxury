"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { occasionBundles } from "@/lib/bundles";

export default function BookingPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const bundle = occasionBundles.find((b) => b.bundleSlug === params.slug);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!bundle) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Bundle nicht gefunden.</p>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleSlug: bundle!.bundleSlug,
          customerName: name,
          customerEmail: email,
          startDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Buchung fehlgeschlagen");
      }

      const { id } = await res.json();
      router.push(`/de/bundles/${bundle!.bundleSlug}/bestaetigung?buchung=${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-marlo-gold/20 px-6 py-6">
        <Link
          href={`/de/bundles/${bundle.bundleSlug}`}
          className="text-sm text-marlo-dark/60 hover:text-marlo-gold"
        >
          &larr; Zurück zum Bundle
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium">Buchung abschließen</h1>
        <p className="mt-2 text-marlo-dark/60">
          {bundle.displayName} — {bundle.priceEur.toLocaleString("de-DE")} € inkl. MwSt.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Vollständiger Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-marlo-gold/30 rounded px-4 py-2.5 focus:outline-none focus:border-marlo-gold"
              placeholder="Max Mustermann"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-Mail-Adresse
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-marlo-gold/30 rounded px-4 py-2.5 focus:outline-none focus:border-marlo-gold"
              placeholder="max@beispiel.de"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Gewünschtes Startdatum
            </label>
            <input
              id="startDate"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-marlo-gold/30 rounded px-4 py-2.5 focus:outline-none focus:border-marlo-gold"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="border-t border-marlo-gold/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-marlo-dark/70">Gesamtbetrag</span>
              <span className="text-xl font-medium">
                {bundle.priceEur.toLocaleString("de-DE")} €
              </span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-marlo-dark text-white py-3 rounded hover:bg-marlo-gold transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? "Wird gebucht..." : "Verbindlich buchen"}
            </button>
            <p className="text-xs text-marlo-dark/50 mt-2 text-center">
              Preis inkl. 19% MwSt. Keine versteckten Kosten.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
