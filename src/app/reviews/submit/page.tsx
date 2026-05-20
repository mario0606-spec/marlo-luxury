"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Nav } from "@/components/nav";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-3xl leading-none focus:outline-none"
        >
          <span className={(hovered || value) >= star ? "text-stone-900" : "text-stone-300"}>★</span>
        </button>
      ))}
    </div>
  );
}

function ReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rentalId = searchParams.get("rentalId") ?? "";

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [occasion, setOccasion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    if (body && body.length > 0 && body.length < 20) {
      setError("Written review must be at least 20 characters.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentalId, rating, reviewBody: body, occasion }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Submission failed.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-6">★</p>
        <h1 className="text-2xl font-light text-stone-900 mb-3">Thank you for your review</h1>
        <p className="text-stone-500 text-sm mb-8">
          Your experience helps others choose the perfect watch for their occasion.
        </p>
        <button
          onClick={() => router.push("/catalog")}
          className="text-xs tracking-widest uppercase border border-stone-900 px-6 py-3 hover:bg-stone-900 hover:text-white transition-colors"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-light text-stone-900 mb-2">Share your experience</h1>
        <p className="text-sm text-stone-500">Your verified rental review helps our community.</p>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-stone-500 mb-3">
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">
          Written Review <span className="text-stone-400">(optional, min 20 chars)</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="How was the watch? Would you recommend it?"
          className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-500 resize-none"
        />
        {body.length > 0 && (
          <p className="text-xs text-stone-400 mt-1">{body.length} characters</p>
        )}
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">
          Occasion <span className="text-stone-400">(optional)</span>
        </label>
        <input
          type="text"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="e.g. Business travel, Wedding, Date night"
          className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-500"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !rating}
        className="w-full bg-stone-900 text-white text-xs tracking-widest uppercase py-4 hover:bg-stone-700 transition-colors disabled:opacity-40"
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

export default function SubmitReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main>
        <Suspense fallback={<div className="p-8 text-center text-stone-400">Loading…</div>}>
          <ReviewForm />
        </Suspense>
      </main>
    </div>
  );
}
