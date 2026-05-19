"use client";

import { useState } from "react";

interface Props {
  rentalId: string;
  waiverPurchased: boolean;
  depositIntentId: string | null;
  depositCaptured: boolean;
  depositRefunded: boolean;
  depositAmount: number;
  depositCaptureAmount: number | null;
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(cents / 100);
}

export function DepositActions({
  rentalId,
  waiverPurchased,
  depositIntentId,
  depositCaptured,
  depositRefunded,
  depositAmount,
  depositCaptureAmount,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (waiverPurchased) {
    return <span className="text-xs text-stone-400">Waiver</span>;
  }

  if (!depositIntentId) {
    return <span className="text-xs text-stone-300">—</span>;
  }

  if (depositCaptured) {
    return (
      <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5">
        Charged {formatEur(depositCaptureAmount ?? depositAmount)}
      </span>
    );
  }

  if (depositRefunded || done) {
    return (
      <span className="text-xs text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5">
        Released
      </span>
    );
  }

  async function act(action: "release" | "capture") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Request failed");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5">
        Held {formatEur(depositAmount)}
      </span>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-1">
        <button
          onClick={() => act("release")}
          disabled={loading}
          className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 disabled:opacity-40"
        >
          Release
        </button>
        <span className="text-stone-300">·</span>
        <button
          onClick={() => act("capture")}
          disabled={loading}
          className="text-xs text-red-600 hover:text-red-800 underline underline-offset-2 disabled:opacity-40"
        >
          Charge
        </button>
      </div>
    </div>
  );
}
