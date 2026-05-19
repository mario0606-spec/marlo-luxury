"use client";

import { useState } from "react";

export function SendOfferButton({ rentalId, disabled }: { rentalId: string; disabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (loading || sent) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/purchase-leads/send-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentalId }),
      });
      if (res.ok) setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent || disabled) {
    return (
      <span className="text-xs text-stone-400 tracking-wide">
        {sent ? "Sent ✓" : "Already sent"}
      </span>
    );
  }

  return (
    <button
      onClick={handleSend}
      disabled={loading}
      className="text-xs text-stone-600 hover:text-stone-900 tracking-wide underline underline-offset-2 disabled:opacity-50"
    >
      {loading ? "Sending…" : "Send offer"}
    </button>
  );
}
