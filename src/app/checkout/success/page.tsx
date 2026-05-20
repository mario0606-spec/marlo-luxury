import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: Promise<{ rentalId?: string; subscription?: string; plan?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const isSubscription = params.subscription === "true";

  if (isSubscription) {
    // Check if this subscriber has already completed onboarding
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { onboardingCompleted: true },
      });

      if (!user?.onboardingCompleted) {
        redirect("/onboarding/quiz");
      }
    } else {
      redirect("/onboarding/quiz");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-stone-900">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-light tracking-wide mb-3">
          {isSubscription ? "Willkommen bei marianni" : "Payment Confirmed"}
        </h1>

        <p className="text-stone-500 mb-10">
          Your rental is confirmed. We'll prepare your item and be in touch with delivery details.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/rentals"
            className="py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            View Rental
          </Link>
          <Link
            href="/dashboard"
            className="py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
