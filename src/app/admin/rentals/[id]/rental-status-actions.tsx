"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RentalStatus = "PENDING" | "CONFIRMED" | "ACTIVE" | "RETURNED" | "CANCELLED" | "OVERDUE";

interface Props {
  rentalId: string;
  currentStatus: RentalStatus;
  hasDispatchLog: boolean;
  hasReturnLog: boolean;
}

const TRANSITIONS: Record<RentalStatus, { next: RentalStatus; label: string; confirmMsg: string }[]> = {
  PENDING: [
    { next: "CONFIRMED", label: "Mark Confirmed", confirmMsg: "Mark this rental as confirmed?" },
    { next: "CANCELLED", label: "Cancel Rental", confirmMsg: "Cancel this rental? This cannot be undone." },
  ],
  CONFIRMED: [
    { next: "ACTIVE", label: "Mark Dispatched", confirmMsg: "Mark this rental as dispatched? A dispatch email will be sent to the customer." },
    { next: "CANCELLED", label: "Cancel Rental", confirmMsg: "Cancel this rental? This cannot be undone." },
  ],
  ACTIVE: [
    { next: "RETURNED", label: "Mark Returned", confirmMsg: "Mark this rental as returned?" },
    { next: "OVERDUE", label: "Mark Overdue", confirmMsg: "Mark this rental as overdue?" },
  ],
  OVERDUE: [
    { next: "RETURNED", label: "Mark Returned", confirmMsg: "Mark this rental as returned?" },
  ],
  RETURNED: [],
  CANCELLED: [],
};

export default function RentalStatusActions({ rentalId, currentStatus, hasDispatchLog, hasReturnLog }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transitions = TRANSITIONS[currentStatus] ?? [];
  if (transitions.length === 0) return null;

  async function handleTransition(next: RentalStatus, confirmMsg: string) {
    if (!confirm(confirmMsg)) return;

    // Client-side gate hints (server also validates)
    if (next === "ACTIVE" && !hasDispatchLog) {
      setError("Upload dispatch condition photos (min. 2) before marking as dispatched.");
      return;
    }
    if (next === "RETURNED" && !hasReturnLog) {
      setError("Upload return condition photos (min. 2) before marking as returned.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {transitions.map((t) => (
          <button
            key={t.next}
            onClick={() => handleTransition(t.next, t.confirmMsg)}
            disabled={loading}
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors disabled:opacity-50 ${
              t.next === "CANCELLED"
                ? "border-red-300 text-red-700 hover:bg-red-50"
                : "bg-stone-900 text-white border-stone-900 hover:bg-stone-700"
            }`}
          >
            {loading ? "Updating..." : t.label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {currentStatus === "CONFIRMED" && !hasDispatchLog && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
          Dispatch condition photos required before this rental can be marked as dispatched.
        </p>
      )}
      {(currentStatus === "ACTIVE" || currentStatus === "OVERDUE") && !hasReturnLog && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
          Return condition photos required before this rental can be marked as returned.
        </p>
      )}
    </div>
  );
}
