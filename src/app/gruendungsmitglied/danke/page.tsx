import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Willkommen, Gründungsmitglied — marianni",
  robots: { index: false },
};

const GOLD = "#C9A84C";
const IVORY = "#FAF7F2";
const CHARCOAL = "#1C1C1C";

export default async function DankePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; name?: string }>;
}) {
  const params = await searchParams;
  const code = params.code ?? "";
  const name = params.name ? decodeURIComponent(params.name) : "";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://marianni.com";
  const referralUrl = `${appUrl}/gruendungsmitglied?ref=${code}`;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
      style={{ background: CHARCOAL }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-sm tracking-[0.4em] uppercase font-light mb-16 focus:outline-none focus:underline"
        style={{ color: GOLD }}
      >
        marianni
      </Link>

      <div className="w-full max-w-lg">
        {/* Confirmation card */}
        <div className="p-10 sm:p-12 mb-6" style={{ background: IVORY }}>
          <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: GOLD }}>
            Gründungsmitglied bestätigt ✓
          </p>
          <h1
            className="text-3xl sm:text-4xl font-light leading-tight mb-4"
            style={{ color: CHARCOAL, fontFamily: "Georgia, serif" }}
          >
            {name ? `Willkommen, ${name}.` : "Willkommen."}
          </h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(28,28,28,0.65)" }}>
            Du bist jetzt eines von 50 Gründungsmitgliedern von marianni.
            Deine erste E-Mail ist bereits unterwegs.
          </p>
        </div>

        {/* Referral block */}
        <div
          className="p-8 sm:p-10 mb-6"
          style={{ background: "#fff", border: `1px solid rgba(201,168,76,0.3)` }}
        >
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xl" aria-hidden="true">💰</span>
            <div>
              <h2 className="text-sm font-medium tracking-wide mb-1" style={{ color: CHARCOAL }}>
                €50 für jeden Freund
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(28,28,28,0.55)" }}>
                Teile deinen persönlichen Link. Jeder Freund, der sich über deinen Link als
                Gründungsmitglied anmeldet: €50 Guthaben für dich.
              </p>
            </div>
          </div>

          {code && (
            <div>
              <label
                className="block text-xs tracking-[0.25em] uppercase mb-2"
                style={{ color: "rgba(28,28,28,0.5)" }}
              >
                Dein Referral-Link
              </label>
              <div
                className="flex items-center gap-2 p-3"
                style={{ background: IVORY, border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <code
                  className="text-xs flex-1 break-all"
                  style={{ color: CHARCOAL, fontFamily: "monospace" }}
                >
                  {referralUrl}
                </code>
              </div>
              <p className="text-xs mt-2" style={{ color: GOLD }}>
                Code: <strong>{code}</strong>
              </p>

              {/* Share buttons */}
              <div className="flex gap-3 mt-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Ich bin Gründungsmitglied bei marianni — dem ersten Luxusuhr-Mietservice im DACH-Raum. Werde du auch Gründungsmitglied: ${referralUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                  style={{ background: GOLD, color: CHARCOAL }}
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:?subject=marianni%20Gr%C3%BCndungsmitglied&body=${encodeURIComponent(`Ich bin jetzt Gründungsmitglied bei marianni — dem ersten Luxusuhr-Mietservice im DACH-Raum. Sichere dir deinen Platz: ${referralUrl}`)}`}
                  className="flex-1 text-center py-2 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                  style={{ background: CHARCOAL, color: IVORY }}
                >
                  E-Mail
                </a>
              </div>
            </div>
          )}
        </div>

        {/* What happens next */}
        <div className="p-8" style={{ background: "rgba(250,247,242,0.06)" }}>
          <h3 className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(250,247,242,0.4)" }}>
            Was jetzt passiert
          </h3>
          <ul className="space-y-3">
            {[
              "Du erhältst sofort eine Bestätigungs-E-Mail mit allen Details.",
              "Wenn marianni startet, wirst du als Erste/r benachrichtigt.",
              "Dein 20%-Rabatt wird automatisch auf deinen ersten Abo-Plan angewendet.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-xs mt-0.5" style={{ color: GOLD }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "rgba(250,247,242,0.55)" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href="/"
        className="mt-12 text-xs tracking-[0.3em] uppercase transition-opacity hover:opacity-60 focus:outline-none focus:underline"
        style={{ color: "rgba(250,247,242,0.3)" }}
      >
        ← Zurück zur Startseite
      </Link>
    </main>
  );
}
