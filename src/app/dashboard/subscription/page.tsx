import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS, formatCents } from "@/lib/stripe";
import { SubscriptionActions } from "@/components/subscription/subscription-actions";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-green-50 text-green-700 border-green-200" },
  PAST_DUE: { label: "Past Due", className: "bg-orange-50 text-orange-700 border-orange-200" },
  PAUSED: { label: "Paused", className: "bg-blue-50 text-blue-700 border-blue-200" },
};

export default async function SubscriptionPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE", "PAUSED"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">marianni</Link>
          <Link href="/dashboard" className="text-sm tracking-wider text-stone-500 hover:text-stone-900">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-light tracking-wide mb-10">Subscription</h1>

        {subscription ? (
          <div className="bg-white border border-stone-200 p-8 max-w-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-500 mb-1">Current Plan</p>
                <p className="text-2xl font-light">
                  {SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS]?.name ?? subscription.plan}
                </p>
              </div>
              {STATUS_LABELS[subscription.status] && (
                <span className={`text-xs px-2 py-1 border ${STATUS_LABELS[subscription.status].className}`}>
                  {STATUS_LABELS[subscription.status].label}
                </span>
              )}
            </div>

            <div className="space-y-3 text-sm text-stone-600 border-t border-stone-100 pt-6 mb-8">
              <div className="flex justify-between">
                <span>Monthly amount</span>
                <span className="font-medium">
                  {formatCents(
                    SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS]?.amount ?? 0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current period</span>
                <span>
                  {subscription.currentPeriodStart.toLocaleDateString()} –{" "}
                  {subscription.currentPeriodEnd.toLocaleDateString()}
                </span>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="flex justify-between text-orange-600 font-medium">
                  <span>Cancels on</span>
                  <span>{subscription.currentPeriodEnd.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <SubscriptionActions mode="active" cancelAtPeriodEnd={subscription.cancelAtPeriodEnd} />
          </div>
        ) : (
          <div>
            <p className="text-stone-500 mb-8">Choose a membership plan to get started.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(
                Object.entries(SUBSCRIPTION_PLANS) as [
                  keyof typeof SUBSCRIPTION_PLANS,
                  (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS],
                ][]
              ).map(([key, plan]) => (
                <div key={key} className="bg-white border border-stone-200 p-8 flex flex-col">
                  <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">{plan.name}</p>
                  <p className="text-3xl font-light mb-1">{formatCents(plan.amount)}</p>
                  <p className="text-xs text-stone-400 mb-4">per month</p>
                  <p className="text-sm text-stone-600 mb-8 flex-1">{plan.description}</p>
                  <SubscriptionActions mode="checkout" plan={key} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
