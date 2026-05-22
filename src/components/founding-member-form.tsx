"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initialRemaining: number;
  referredBy?: string;
}

export function FoundingMemberForm({ initialRemaining, referredBy }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(initialRemaining);

  const soldOut = remaining <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (soldOut) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/founding-member/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, referredBy }),
      });

      const data = await res.json() as {
        success?: boolean;
        error?: string;
        soldOut?: boolean;
        referralCode?: string;
        slotsRemaining?: number;
      };

      if (!res.ok) {
        if (data.soldOut) {
          setRemaining(0);
          setError("Leider sind alle 50 Gründungsplätze vergeben.");
        } else {
          setError(data.error ?? "Etwas ist schiefgelaufen.");
        }
        return;
      }

      if (data.slotsRemaining != null) {
        setRemaining(data.slotsRemaining);
      }

      router.push(`/gruendungsmitglied/danke?code=${data.referralCode}&name=${encodeURIComponent(firstName)}`);
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (soldOut) {
    return (
      <div className="text-center py-8 px-6 border-2" style={{ borderColor: "rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.05)" }}>
        <p className="text-sm tracking-widest uppercase mb-2" style={{ color: "#C9A84C" }}>Ausgebucht</p>
        <p className="text-sm" style={{ color: "rgba(28,28,28,0.6)" }}>
          Alle 50 Gründungsplätze sind vergeben. Reguläre Anmeldung bald verfügbar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="fm-firstName"
          className="block text-xs tracking-[0.25em] uppercase mb-2"
          style={{ color: "rgba(28,28,28,0.6)" }}
        >
          Vorname
        </label>
        <input
          id="fm-firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoComplete="given-name"
          placeholder="Dein Vorname"
          className="w-full px-4 py-3 text-sm border outline-none transition-colors"
          style={{
            background: "#fff",
            borderColor: "rgba(28,28,28,0.2)",
            color: "#1C1C1C",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(28,28,28,0.2)")}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="fm-email"
          className="block text-xs tracking-[0.25em] uppercase mb-2"
          style={{ color: "rgba(28,28,28,0.6)" }}
        >
          E-Mail
        </label>
        <input
          id="fm-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="deine@email.de"
          className="w-full px-4 py-3 text-sm border outline-none transition-colors"
          style={{
            background: "#fff",
            borderColor: "rgba(28,28,28,0.2)",
            color: "#1C1C1C",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(28,28,28,0.2)")}
        />
      </div>

      {error && (
        <p className="text-sm mb-4 text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-sm tracking-[0.3em] uppercase transition-opacity disabled:opacity-60"
        style={{ background: "#C9A84C", color: "#1C1C1C" }}
      >
        {loading ? "Wird gespeichert…" : "Gründungsplatz sichern →"}
      </button>

      <p className="text-xs mt-4 text-center" style={{ color: "rgba(28,28,28,0.4)" }}>
        Keine Mindestlaufzeit. Jederzeit kündbar. Datenschutz nach DSGVO. ✓
      </p>

      <p className="text-xs mt-1 text-center" style={{ color: "#C9A84C" }}>
        Noch {remaining} von 50 Plätzen verfügbar
      </p>
    </form>
  );
}
