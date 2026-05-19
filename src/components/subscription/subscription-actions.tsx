"use client";

import { useState } from "react";

type Mode = "active" | "checkout";

interface ActiveProps {
  mode: "active";
  cancelAtPeriodEnd: boolean;
}

interface CheckoutProps {
  mode: "checkout";
  plan: string;
}

type Props = ActiveProps | CheckoutProps;

export function SubscriptionActions(props: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscriptions/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to open portal");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancel your subscription at the end of the current period?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ immediately: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to cancel");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (props.mode !== "checkout") return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: props.plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (props.mode === "checkout") {
    return (
      <div>
        {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading…" : "Subscribe"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        onClick={handlePortal}
        disabled={loading}
        className="py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Loading…" : "Manage Billing"}
      </button>
      {!props.cancelAtPeriodEnd && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 disabled:opacity-50 transition-colors"
        >
          Cancel Subscription
        </button>
      )}
    </div>
  );
}
