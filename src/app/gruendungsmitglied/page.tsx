import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FOUNDING_MEMBER_LIMIT, FOUNDING_WINDOW_END } from "@/lib/founding-member";
import { CountdownTimer } from "@/components/countdown-timer";
import { FoundingMemberForm } from "@/components/founding-member-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gründungsmitglied — marianni",
  description:
    "Werde eines von 50 Gründungsmitgliedern. Erste 3 Monate 20 % Rabatt, persönliche Willkommenskarte, €50 Referral-Guthaben.",
};

const GOLD = "#C9A84C";
const IVORY = "#FAF7F2";
const CHARCOAL = "#1C1C1C";

export default async function GruendungsmitgliedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const referredBy = params.ref;

  const memberCount = await prisma.foundingMember.count();
  const remaining = Math.max(0, FOUNDING_MEMBER_LIMIT - memberCount);
  const soldOut = remaining <= 0;
  const endDateISO = FOUNDING_WINDOW_END.toISOString();

  return (
    <main style={{ background: IVORY, color: CHARCOAL, overflowX: "hidden" }}>
      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav
        style={{ borderBottom: `1px solid rgba(201,168,76,0.2)`, background: CHARCOAL }}
        className="fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm tracking-[0.4em] uppercase font-light focus:outline-none focus:underline"
            style={{ color: GOLD }}
            aria-label="marianni home"
          >
            marianni
          </Link>
          <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(250,247,242,0.4)" }}>
            Gründungsmitglied
          </p>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center min-h-screen pt-16 pb-20 px-4 sm:px-6"
        style={{ background: CHARCOAL }}
        aria-labelledby="hero-heading"
      >
        {/* Ambient gold glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Scarcity chip */}
          {soldOut ? (
            <div
              className="inline-block mb-8 px-5 py-2 text-xs tracking-[0.3em] uppercase"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: GOLD }}
            >
              Ausgebucht — alle 50 Plätze vergeben
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-2 mb-8 px-5 py-2 text-xs tracking-[0.3em] uppercase"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: GOLD }}
              aria-live="polite"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#cc3333" }}
                aria-hidden="true"
              />
              Noch {remaining} von 50 Gründungsplätzen verfügbar
            </div>
          )}

          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-7xl font-light leading-tight mb-6"
            style={{ color: IVORY, letterSpacing: "0.01em" }}
          >
            Du gehörst zu
            <br />
            <span style={{ color: GOLD }}>den Ersten.</span>
          </h1>

          <p className="text-base sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light" style={{ color: "rgba(250,247,242,0.65)" }}>
            marianni geht live — exklusiv für unsere 50 Gründungsmitglieder.
            <br className="hidden sm:block" />
            Luxusuhren mieten, nicht kaufen. Rolex. Omega. Patek Philippe.
            <br className="hidden sm:block" />
            Für den Moment, der zählt.
          </p>

          {!soldOut && (
            <a
              href="#anmelden"
              className="inline-block px-10 py-4 text-sm tracking-[0.3em] uppercase transition-opacity hover:opacity-80"
              style={{ background: GOLD, color: CHARCOAL }}
            >
              Jetzt Gründungsplatz sichern →
            </a>
          )}
        </div>
      </section>

      {/* ── Angebot ─────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-4 sm:px-6"
        style={{ background: IVORY }}
        aria-labelledby="angebot-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: GOLD }}>
              Nur für Gründungsmitglieder
            </p>
            <h2
              id="angebot-heading"
              className="text-3xl sm:text-4xl font-light tracking-wide"
              style={{ color: CHARCOAL }}
            >
              Was Gründungsmitglieder bekommen.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🎁",
                title: "20 % Rabatt — erste 3 Monate",
                body: "Dein Abo auf dem Plan deiner Wahl. Automatisch. Kein Code nötig.",
              },
              {
                icon: "✉️",
                title: "Persönliche Willkommenskarte",
                body: "Deine erste Uhr kommt mit einer handgeschriebenen Willkommenskarte von uns.",
              },
              {
                icon: "👑",
                title: "Gründungsmitglied-Badge",
                body: "Für immer auf deinem Konto hinterlegt. Du warst dabei, als es anfing.",
              },
              {
                icon: "💰",
                title: "€50 für jeden Freund",
                body: "Dein persönlicher Einladungslink. Jeder Freund, der beitritt: €50 Guthaben für dich.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-8"
                style={{ background: "#fff", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <div className="text-3xl mb-4" aria-hidden="true">{card.icon}</div>
                <h3
                  className="text-base font-medium mb-3 tracking-wide"
                  style={{ color: CHARCOAL }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(28,28,28,0.6)" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Framing / Pull Quote ─────────────────────────────────────────────── */}
      <section
        className="py-24 px-4 sm:px-6"
        style={{ background: CHARCOAL }}
        aria-label="Warum marianni"
      >
        <div className="max-w-3xl mx-auto text-center">
          <blockquote>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl font-light italic leading-relaxed mb-10"
              style={{ color: GOLD, fontFamily: "Georgia, serif" }}
            >
              „Du bist eine der ersten 50 Personen im DACH-Raum,
              <br className="hidden sm:block" />
              die Luxusuhren so erleben — mit Stil, ohne zu kaufen."
            </p>
          </blockquote>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(250,247,242,0.6)" }}>
            marianni ist der erste Luxusuhr-Mietservice für den deutschsprachigen Markt. Rolex, Omega,
            Patek Philippe und IWC — für das Wochenende, die Hochzeit, das wichtige Meeting.
          </p>
          <p className="text-sm mt-6 leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(250,247,242,0.4)" }}>
            Die Warteliste für eine Patek Philippe Nautilus beträgt acht Jahre.
            Bei marianni sind es 48 Stunden.
          </p>
        </div>
      </section>

      {/* ── Dringlichkeit / Countdown ──────────────────────────────────────── */}
      <section
        className="py-24 px-4 sm:px-6 text-center"
        style={{ background: IVORY }}
        aria-labelledby="countdown-heading"
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: GOLD }}>
            Zeitlich begrenzt
          </p>
          <h2
            id="countdown-heading"
            className="text-2xl sm:text-3xl font-light tracking-wide mb-12"
            style={{ color: CHARCOAL }}
          >
            Das Gründungsangebot endet in:
          </h2>

          <CountdownTimer endDate={new Date(endDateISO)} />

          <p className="text-sm mt-10 leading-relaxed" style={{ color: "rgba(28,28,28,0.5)" }}>
            Sobald die 50 Gründungsplätze vergeben sind, gelten reguläre Preise. Kein Nachrücken.
          </p>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-4 sm:px-6"
        style={{ background: "#fff" }}
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: GOLD }}>
              Beta-Erfahrungen
            </p>
            <h2
              id="testimonials-heading"
              className="text-2xl sm:text-3xl font-light tracking-wide"
              style={{ color: CHARCOAL }}
            >
              Echte Momente. Echte Uhren.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                quote:
                  "Ich habe mir für meine Hochzeit eine IWC Portofino geliehen. Es war genau das Richtige — und ich musste nicht €8.000 ausgeben, um es zu spüren.",
                name: "Markus R.",
                city: "München",
              },
              {
                quote:
                  "Das Konzept kannte ich von Kleidung. Dass es das jetzt für Uhren gibt, im DACH-Markt, auf Deutsch — das hat gefehlt.",
                name: "Julia W.",
                city: "Wien",
              },
            ].map((t) => (
              <article
                key={t.name}
                className="p-8"
                style={{ border: `1px solid rgba(201,168,76,0.2)`, background: IVORY }}
              >
                <div
                  className="text-3xl leading-none mb-4 font-serif select-none"
                  style={{ color: GOLD }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <p className="text-sm leading-relaxed italic mb-6" style={{ color: "rgba(28,28,28,0.7)" }}>
                  {t.quote}
                </p>
                <div style={{ borderTop: `1px solid rgba(201,168,76,0.2)`, paddingTop: "1rem" }}>
                  <p className="text-sm font-medium" style={{ color: CHARCOAL }}>{t.name}</p>
                  <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "rgba(28,28,28,0.4)" }}>{t.city}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Anmeldeformular / CTA ───────────────────────────────────────────── */}
      <section
        id="anmelden"
        className="py-24 px-4 sm:px-6"
        style={{ background: CHARCOAL }}
        aria-labelledby="cta-heading"
      >
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: GOLD }}>
            Jetzt anmelden
          </p>
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl font-light mb-4 tracking-wide"
            style={{ color: IVORY }}
          >
            Sei dabei. Nicht irgendwann — jetzt.
          </h2>
          <p className="text-sm mb-12 leading-relaxed" style={{ color: "rgba(250,247,242,0.5)" }}>
            {soldOut
              ? "Alle Gründungsplätze sind vergeben."
              : `Gründungsplatz sichern — 20 % Rabatt auf die ersten 3 Monate.`}
          </p>

          <div className="bg-white p-8 sm:p-10">
            <FoundingMemberForm
              initialRemaining={remaining}
              referredBy={referredBy}
            />
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-12 px-4 sm:px-6 text-center"
        style={{ background: CHARCOAL, borderTop: "1px solid rgba(201,168,76,0.15)" }}
        role="contentinfo"
      >
        <Link
          href="/"
          className="text-sm tracking-[0.4em] uppercase font-light mb-4 inline-block focus:outline-none focus:underline"
          style={{ color: GOLD }}
          aria-label="marianni home"
        >
          marianni
        </Link>
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(250,247,242,0.3)" }}>
          Trage den Moment.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-xs" style={{ color: "rgba(250,247,242,0.3)" }}>
          <Link href="/privacy" className="hover:opacity-70 transition-opacity">
            Datenschutz
          </Link>
          <Link href="/terms" className="hover:opacity-70 transition-opacity">
            AGB
          </Link>
        </div>
      </footer>
    </main>
  );
}
