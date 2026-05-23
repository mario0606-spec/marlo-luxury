"use client";

import { useState } from "react";

interface Review {
  id: string;
  rating: number;
  body: string | null;
  occasion: string | null;
  verifiedRental: boolean;
  reviewerName: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number | null;
  totalReviews: number;
  itemSlug: string;
  reviewCta?: { href: string; label: string } | null;
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-xl" : "text-sm";
  return (
    <span className={cls}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-amber-400" : "text-stone-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ReviewsSection({ reviews, averageRating, totalReviews, itemSlug, reviewCta }: ReviewsSectionProps) {
  void itemSlug;
  const [occasionFilter, setOccasionFilter] = useState<string>("all");

  const occasions = Array.from(new Set(reviews.map((r) => r.occasion).filter(Boolean))) as string[];

  const ratingCounts: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const k = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    ratingCounts[k] += 1;
  }

  const filtered =
    occasionFilter === "all"
      ? reviews
      : reviews.filter((r) => r.occasion === occasionFilter);

  return (
    <div className="border border-stone-200 bg-white p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-3">
            Member Reviews
          </h2>
          {totalReviews >= 3 && averageRating !== null ? (
            <div className="flex items-center gap-3">
              <StarDisplay rating={Math.round(averageRating)} size="lg" />
              <span className="text-2xl font-light text-stone-900">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-stone-400">— {totalReviews} rental{totalReviews !== 1 ? "s" : ""}</span>
            </div>
          ) : (
            <p className="text-sm text-stone-400">
              {totalReviews === 0
                ? "Be the first to review this watch"
                : `${totalReviews} review${totalReviews !== 1 ? "s" : ""} — more needed for summary`}
            </p>
          )}
          {reviewCta && (
            <a
              href={reviewCta.href}
              className="inline-block mt-4 text-xs tracking-widest uppercase text-stone-900 border-b border-stone-900 hover:text-stone-600 hover:border-stone-600 pb-0.5"
            >
              {reviewCta.label}
            </a>
          )}
        </div>

        {totalReviews >= 3 && (
          <dl className="md:w-72 space-y-1.5" aria-label="Rating breakdown">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const c = ratingCounts[star];
              const pct = totalReviews > 0 ? Math.round((c / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <dt className="text-stone-500 w-6 tabular-nums">{star}★</dt>
                  <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <dd className="text-stone-500 w-10 text-right tabular-nums">{c}</dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>

      {occasions.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setOccasionFilter("all")}
            className={`text-xs tracking-wider px-3 py-1 border transition-colors ${
              occasionFilter === "all"
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            All
          </button>
          {occasions.map((occ) => (
            <button
              key={occ}
              onClick={() => setOccasionFilter(occ)}
              className={`text-xs tracking-wider px-3 py-1 border transition-colors ${
                occasionFilter === occ
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-stone-400 py-4">No reviews for this occasion yet.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((review) => (
            <div key={review.id} className="border-t border-stone-100 pt-5 first:border-t-0 first:pt-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <StarDisplay rating={review.rating} />
                  {review.verifiedRental && (
                    <span className="text-xs tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                      Verified Rental
                    </span>
                  )}
                  {review.occasion && (
                    <span className="text-xs text-stone-400 border border-stone-200 px-2 py-0.5">
                      {review.occasion}
                    </span>
                  )}
                </div>
                <time className="text-xs text-stone-400">
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p className="text-xs text-stone-500 mb-2">{review.reviewerName}</p>
              {review.body && (
                <p className="text-sm text-stone-700 leading-relaxed">{review.body}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalReviews === 0 && (
        <p className="text-xs text-stone-400 mt-4">
          Rent this piece to leave the first review.
        </p>
      )}
    </div>
  );
}
