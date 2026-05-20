import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS, formatCents } from "@/lib/stripe";
import { SubscriptionActions } from "@/components/subscription/subscription-actions";
import { NavServer as Nav } from "@/components/nav-server";

export const metadata: Metadata = {
  title: "Membership Plans — Marlo",
  description:
    "Join Marlo's luxury watch subscription. Monthly curated selections from Rolex, Patek Philippe, IWC, and the finest watchmakers.",
};

const PLAN_DETAILS = {
  BASIC: {
    tagline: "The Surprise",
    highlight: "One mystery timepiece, monthly",
    bullets: [
      "Monthly curated watch, chosen by our specialists",
      "Delivery & returns included",
      "Access to seasonal exclusives",
      "Pause or cancel anytime",
    ],
    example: "Past selections: TAG Heuer Carrera, IWC Pilot, Omega Seamaster",
    accent: false,
  },
  PREMIUM: {
    tagline: "The Curator",
    highlight: "Choose from our monthly edit",
    bullets: [
      "Select from 5–8 curated watches each month",
      "Priority access to new arrivals",
      "Complimentary watch cloth & care kit",
      "Pause or cancel anytime",
    ],
    example: "Selections include: Rolex Explorer, Patek Calatrava, Nomos Tangente",
    accent: true,
  },
  VIP: {
    tagline: "The Connoisseur",
    highlight: "White-glove concierge selection",
    bullets: [
      "Personal watch concierge for each delivery",
      "Unlimited swaps — change whenever you like",
      "Dedicated relationship manager",
      "First access to rare & limited references",
    ],
    example: "Rolex Daytona, Patek Nautilus, AP Royal Oak — unrestricted access",
    accent: false,
  },
} as const;

export default async function SubscribePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (userId) {
    const activeSub = await prisma.subscription.findFirst({
      where: { userId, status: { in: ["ACTIVE", "PAST_DUE", "PAUSED"] } },
    });
    if (activeSub) redirect("/dashboard/subscription");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      {/* Hero */}
      <section className="bg-stone-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-gold-400 mb-4">Membership</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
            Wear what you love.<br />Return when you&apos;re ready.
          </h1>
          <p className="text-stone-400 text-lg font-light max-w-2xl mx-auto">
            A Marlo membership gives you access to iconic timepieces — delivered to your door,
            swapped on your schedule. No commitment to buy. No insurance to arrange.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(SUBSCRIPTION_PLANS) as [keyof typeof SUBSCRIPTION_PLANS, typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS]][]).map(
              ([key, plan]) => {
                const detail = PLAN_DETAILS[key];
                return (
                  <div
                    key={key}
                    className={`flex flex-col p-8 ${
                      detail.accent
                        ? "bg-stone-900 text-white border border-stone-800"
                        : "bg-white border border-stone-200"
                    }`}
                  >
                    <div className="mb-8">
                      <p
                        className={`text-xs tracking-[0.35em] uppercase mb-2 ${
                          detail.accent ? "text-gold-400" : "text-stone-500"
                        }`}
                      >
                        {detail.tagline}
                      </p>
                      <p
                        className={`text-2xl font-light mb-1 ${
                          detail.accent ? "text-white" : "text-stone-900"
                        }`}
                      >
                        {plan.name}
                      </p>
                      <p
                        className={`text-sm mb-6 ${
                          detail.accent ? "text-stone-300" : "text-stone-600"
                        }`}
                      >
                        {detail.highlight}
                      </p>

                      <div className="flex items-baseline gap-1 mb-8">
                        <span
                          className={`text-4xl font-light ${
                            detail.accent ? "text-white" : "text-stone-900"
                          }`}
                        >
                          {formatCents(plan.amount)}
                        </span>
                        <span
                          className={`text-sm ${
                            detail.accent ? "text-stone-400" : "text-stone-500"
                          }`}
                        >
                          / month
                        </span>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {detail.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 text-xs ${
                                detail.accent ? "text-gold-400" : "text-stone-400"
                              }`}
                            >
                              ✦
                            </span>
                            <span
                              className={`text-sm ${
                                detail.accent ? "text-stone-300" : "text-stone-600"
                              }`}
                            >
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <p
                        className={`text-xs italic ${
                          detail.accent ? "text-stone-500" : "text-stone-400"
                        }`}
                      >
                        {detail.example}
                      </p>
                    </div>

                    <div className="mt-auto">
                      {userId ? (
                        <SubscriptionActions mode="checkout" plan={key} />
                      ) : (
                        <Link
                          href={`/auth/signup?callbackUrl=/subscribe`}
                          className={`block w-full py-3 text-center text-sm tracking-widest uppercase transition-colors ${
                            detail.accent
                              ? "bg-gold-500 text-stone-900 hover:bg-gold-400"
                              : "bg-stone-900 text-white hover:bg-stone-700"
                          }`}
                        >
                          Start membership
                        </Link>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light tracking-wide text-center mb-16">How membership works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Choose a plan", body: "Select the tier that fits how you wear time." },
              { step: "02", title: "Tell us your taste", body: "A short quiz helps us understand your style, occasions, and preferred brands." },
              { step: "03", title: "Confirm your first watch", body: "We present a curated selection. You choose, we ship." },
              { step: "04", title: "Wear. Return. Repeat.", body: "At month end, return your watch and receive your next curation." },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="text-xs tracking-widest text-gold-500 mb-3">{step}</p>
                <p className="font-light text-stone-900 mb-2">{title}</p>
                <p className="text-sm text-stone-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-light tracking-wide text-center mb-12">Questions</h2>
          <div className="space-y-8">
            {[
              {
                q: "What happens if a watch is damaged?",
                a: "Each rental includes a standard damage waiver. Accidental wear is covered. Intentional damage or loss is assessed separately — we'll always be transparent.",
              },
              {
                q: "Can I skip a month?",
                a: "Yes. Members can pause their subscription from the account dashboard at any time. No penalties.",
              },
              {
                q: "Is there a minimum commitment?",
                a: "No. Month-to-month membership. Cancel before your next billing date and you won't be charged again.",
              },
              {
                q: "What watches are in the collection?",
                a: "Rolex, Patek Philippe, IWC, Breitling, Omega, TAG Heuer, Nomos, and more. The collection is updated regularly.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-stone-100 pb-8">
                <p className="font-light text-stone-900 mb-2">{q}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
