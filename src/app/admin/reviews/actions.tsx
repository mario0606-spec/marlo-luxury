"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  reviewId: string;
  currentStatus: string;
}

export function ReviewModerationActions({ reviewId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: string) {
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {currentStatus !== "APPROVED" && (
        <button
          onClick={() => setStatus("APPROVED")}
          disabled={loading}
          className="text-xs tracking-widest uppercase px-3 py-1.5 border border-stone-200 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-colors disabled:opacity-40"
        >
          Approve
        </button>
      )}
      {currentStatus !== "FLAGGED" && (
        <button
          onClick={() => setStatus("FLAGGED")}
          disabled={loading}
          className="text-xs tracking-widest uppercase px-3 py-1.5 border border-amber-200 text-amber-700 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-colors disabled:opacity-40"
        >
          Flag
        </button>
      )}
      {currentStatus !== "REMOVED" && (
        <button
          onClick={() => setStatus("REMOVED")}
          disabled={loading}
          className="text-xs tracking-widest uppercase px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors disabled:opacity-40"
        >
          Remove
        </button>
      )}
    </div>
  );
}
