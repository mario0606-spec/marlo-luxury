import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NavServer as Nav } from "@/components/nav-server";
import ReviewForm from "./review-form";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ rentalId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export const metadata: Metadata = { title: "Leave a Review — Marlo" };

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const { rentalId } = await params;
  const { token } = await searchParams;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId && !token) {
    redirect(`/auth/signin?callbackUrl=/reviews/${rentalId}`);
  }

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: {
      item: { select: { name: true, brand: true, images: true } },
      review: { select: { id: true } },
    },
  });

  if (!rental) notFound();
  if (rental.status !== "RETURNED") notFound();

  // Auth check
  if (userId && rental.userId !== userId) notFound();

  if (!userId && token) {
    const expected = Buffer.from(
      `${rentalId}:${process.env.REVIEW_TOKEN_SECRET ?? "review-secret"}`
    ).toString("base64");
    if (token !== expected) notFound();
  }

  // Already reviewed
  if (rental.review) {
    redirect(`/reviews/${rentalId}/thanks`);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main className="max-w-xl mx-auto px-4 py-16">
        <div className="mb-8 flex items-center gap-4">
          {rental.item.images[0] && (
            <div className="w-16 h-16 flex-shrink-0 bg-stone-100 overflow-hidden border border-stone-200">
              <img
                src={rental.item.images[0]}
                alt={rental.item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-400">{rental.item.brand}</p>
            <h1 className="text-xl font-light text-stone-900">{rental.item.name}</h1>
          </div>
        </div>

        <ReviewForm rentalId={rentalId} token={token} />
      </main>
    </div>
  );
}
