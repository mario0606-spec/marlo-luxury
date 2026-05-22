import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { ReviewModerationActions } from "./actions";

export const metadata: Metadata = { title: "Review Moderation" };

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = (sp.status as "APPROVED" | "FLAGGED" | "REMOVED") ?? "APPROVED";

  const reviews = await prisma.review.findMany({
    where: { status },
    include: {
      user: { select: { name: true, email: true } },
      item: { select: { name: true, brand: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-stone-900">Review Moderation</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {(["APPROVED", "FLAGGED", "REMOVED"] as const).map((s) => (
          <Link
            key={s}
            href={`/admin/reviews?status=${s}`}
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              status === s
                ? "bg-stone-900 text-white border-stone-900"
                : "border-stone-200 text-stone-600 hover:border-stone-900"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <p className="text-stone-400 text-sm">No reviews with status {status}.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-stone-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-stone-900">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    {review.verifiedRental && (
                      <span className="text-xs text-stone-400 border border-stone-200 px-2 py-0.5">Verified</span>
                    )}
                    {review.occasion && (
                      <span className="text-xs text-stone-400">{review.occasion}</span>
                    )}
                  </div>
                  {review.body && (
                    <p className="text-sm text-stone-600 mb-3 leading-relaxed">{review.body}</p>
                  )}
                  <div className="text-xs text-stone-400 space-y-0.5">
                    <p>
                      By{" "}
                      <span className="text-stone-600">{review.user.name ?? "—"}</span>{" "}
                      ({review.user.email})
                    </p>
                    <p>
                      Item:{" "}
                      <Link
                        href={`/catalog/${review.item.slug}`}
                        className="text-stone-600 hover:underline"
                        target="_blank"
                      >
                        {review.item.brand} {review.item.name}
                      </Link>
                    </p>
                    <p>{new Date(review.createdAt).toLocaleDateString("de-DE")}</p>
                  </div>
                </div>

                <ReviewModerationActions reviewId={review.id} currentStatus={status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

