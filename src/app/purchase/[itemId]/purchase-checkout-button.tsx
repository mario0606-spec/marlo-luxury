"use client";

import { useState } from "react";

export function PurchaseCheckoutButton({ rentalId, itemId }: { rentalId: string; itemId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/purchase/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentalId, itemId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-stone-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Complete Purchase"}
      </button>
    </div>
  );
}
