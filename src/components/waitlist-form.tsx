"use client";

import { useState } from "react";

interface WaitlistFormProps {
  source?: string;
}

export function WaitlistForm({ source = "homepage" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (res.ok && data.success) {
        setState("success");
        setEmail("");
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-4" role="status" aria-live="polite">
        <div
          className="text-gold-400 text-5xl mb-5 font-light leading-none"
          aria-hidden="true"
        >
          ✓
        </div>
        <p className="text-white text-lg font-light tracking-wide">
          You&apos;re on the list.
        </p>
        <p className="text-stone-400 text-sm mt-2">
          We&apos;ll reach out when we launch.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
        aria-label="Join the Marlo waitlist"
        noValidate
      >
        <label htmlFor="waitlist-email" className="sr-only">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-white/8 border border-white/15 text-white placeholder-stone-500 px-5 py-3.5 focus:outline-none focus:border-gold-400 transition-colors text-sm tracking-wide"
          required
          disabled={state === "loading"}
          autoComplete="email"
          aria-describedby={state === "error" ? "waitlist-error" : undefined}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="bg-gold-500 hover:bg-gold-400 text-stone-900 px-7 py-3.5 text-xs font-medium tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold-300"
        >
          {state === "loading" ? "Joining…" : "Join Waitlist"}
        </button>
      </form>

      {state === "error" && errorMsg && (
        <p
          id="waitlist-error"
          className="text-red-400 text-xs mt-3 text-center"
          role="alert"
          aria-live="assertive"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}
