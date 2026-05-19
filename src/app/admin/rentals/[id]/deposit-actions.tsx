"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  rentalId: string;
  depositAmount: number; // cents
  depositCaptured: boolean;
  depositRefunded: boolean;
  depositIntentId: string | null;
  waiverPurchased: boolean;
  returnStatus: "PASS" | "DAMAGE_NOTED" | "FAIL";
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(cents / 100);
}

export default function DepositActions({
  rentalId,
  depositAmount,
  depositCaptured,
  depositRefunded,
  depositIntentId,
  waiverPurchased,
  returnStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captureAmount, setCaptureAmount] = useState(depositAmount / 100);

  async function act(action: "release" | "capture") {
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { action };
      if (action === "capture") body.captureAmount = Math.round(captureAmount * 100);
      const res = await fetch(`/api/admin/rentals/${rentalId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Action failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (waiverPurchased) {
    return (
      <div className="mt-4 text-xs text-stone-500 border border-stone-200 px-4 py-3 bg-stone-50">
        Damage waiver was purchased — no deposit hold to manage.
      </div>
    );
  }

  if (!depositIntentId) {
    return (
      <div className="mt-4 text-xs text-stone-400">No deposit hold on file for this rental.</div>
    );
  }

  if (depositCaptured) {
    return (
      <div className="mt-4 text-xs text-green-700 bg-green-50 border border-green-200 px-4 py-3">
        Deposit captured — charge completed.
      </div>
    );
  }

  if (depositRefunded) {
    return (
      <div className="mt-4 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-4 py-3">
        Deposit released — hold cancelled.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {returnStatus === "PASS" && (
        <button
          onClick={() => act("release")}
          disabled={loading}
          className="w-full sm:w-auto bg-green-700 text-white text-xs tracking-widest uppercase px-6 py-2 hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Processing…" : `Release Deposit (${formatEur(depositAmount)})`}
        </button>
      )}
      {(returnStatus === "DAMAGE_NOTED" || returnStatus === "FAIL") && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className="text-xs tracking-widest uppercase text-stone-500">Capture Amount (€)</label>
            <input
              type="number"
              value={captureAmount}
              onChange={(e) => setCaptureAmount(Number(e.target.value))}
              min={0}
              max={depositAmount / 100}
              step={0.01}
              className="w-28 border border-stone-200 px-2 py-1 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
            />
            <span className="text-xs text-stone-400">max {formatEur(depositAmount)}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => act("capture")}
              disabled={loading}
              className="bg-red-700 text-white text-xs tracking-widest uppercase px-6 py-2 hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Processing…" : "Capture Deposit"}
            </button>
            <button
              onClick={() => act("release")}
              disabled={loading}
              className="border border-stone-300 text-stone-600 text-xs tracking-widest uppercase px-6 py-2 hover:border-stone-500 transition-colors disabled:opacity-50"
            >
              Release Instead
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
