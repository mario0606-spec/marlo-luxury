import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ConditionLogForm from "./condition-log-form";
import DepositActions from "./deposit-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Rental Detail" };

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

const RENTAL_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pending Payment", cls: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", cls: "text-blue-700 bg-blue-50 border-blue-200" },
  ACTIVE: { label: "Active", cls: "text-green-700 bg-green-50 border-green-200" },
  RETURNED: { label: "Returned", cls: "text-stone-600 bg-stone-50 border-stone-200" },
  CANCELLED: { label: "Cancelled", cls: "text-red-700 bg-red-50 border-red-200" },
  OVERDUE: { label: "Overdue", cls: "text-orange-700 bg-orange-50 border-orange-200" },
};

const DEPOSIT_STATUS: Record<string, { label: string; cls: string }> = {
  PASS: { label: "Pass — Release Deposit", cls: "text-green-700 bg-green-50 border-green-200" },
  DAMAGE_NOTED: { label: "Damage Noted — Review Deposit", cls: "text-amber-700 bg-amber-50 border-amber-200" },
  FAIL: { label: "Fail — Charge Deposit", cls: "text-red-700 bg-red-50 border-red-200" },
};

export default async function AdminRentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      item: { select: { name: true, brand: true, slug: true, referenceNumber: true } },
      user: { select: { email: true, name: true } },
      conditionLogs: { orderBy: { phase: "asc" } },
    },
  });

  if (!rental) notFound();

  const dispatchLog = rental.conditionLogs.find((l) => l.phase === "DISPATCH") ?? null;
  const returnLog = rental.conditionLogs.find((l) => l.phase === "RETURN") ?? null;
  const shortRef = rental.id.slice(-8).toUpperCase();
  const rentalStatus = RENTAL_STATUS[rental.status] ?? { label: rental.status, cls: "text-stone-600 bg-stone-50 border-stone-200" };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/rentals" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700">
            ← Rentals
          </Link>
          <h1 className="text-3xl font-light tracking-wide text-stone-900 mt-2">
            {rental.item.name}
          </h1>
          <p className="text-stone-400 text-sm mt-1">{rental.item.brand}{rental.item.referenceNumber ? ` · ${rental.item.referenceNumber}` : ""}</p>
        </div>
        <span className={`text-xs tracking-widest uppercase px-3 py-1 border mt-6 ${rentalStatus.cls}`}>
          {rentalStatus.label}
        </span>
      </div>

      {/* Rental Info */}
      <section className="bg-white border border-stone-200 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Reference</p>
          <p className="font-mono text-sm text-stone-700">MAR-{shortRef}</p>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Customer</p>
          <p className="text-sm text-stone-900">{rental.user.name ?? "—"}</p>
          <p className="text-xs text-stone-400">{rental.user.email}</p>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Rental Period</p>
          <p className="text-sm text-stone-700">
            {rental.startDate.toLocaleDateString("de-DE")} — {rental.endDate.toLocaleDateString("de-DE")}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Amount</p>
          <p className="text-sm text-stone-900">{formatEur(rental.totalAmount)}</p>
          <p className="text-xs text-stone-400">Deposit: {formatEur(rental.depositAmount)}</p>
        </div>
      </section>

      {/* Dispatch Condition Log */}
      <section className="bg-white border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-light tracking-wide text-stone-900">Dispatch Condition</h2>
          <span className="text-xs tracking-widest uppercase text-stone-400 border border-stone-200 px-2 py-0.5">
            Before Dispatch
          </span>
          {dispatchLog && (
            <span className={`text-xs tracking-widest uppercase px-2 py-0.5 border ${
              dispatchLog.status === "PASS" ? "text-green-700 bg-green-50 border-green-200" :
              dispatchLog.status === "DAMAGE_NOTED" ? "text-amber-700 bg-amber-50 border-amber-200" :
              "text-red-700 bg-red-50 border-red-200"
            }`}>
              {dispatchLog.status.replace("_", " ")}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 mb-4">
          Document the item&apos;s condition before it leaves the warehouse.
        </p>
        <ConditionLogForm
          rentalId={rental.id}
          phase="DISPATCH"
          existing={dispatchLog ? {
            ...dispatchLog,
            createdAt: dispatchLog.createdAt.toISOString(),
            updatedAt: dispatchLog.updatedAt.toISOString(),
          } : null}
        />
      </section>

      {/* Return Condition Log */}
      <section className="bg-white border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-light tracking-wide text-stone-900">Return Condition</h2>
          <span className="text-xs tracking-widest uppercase text-stone-400 border border-stone-200 px-2 py-0.5">
            After Return
          </span>
          {returnLog && (
            <span className={`text-xs tracking-widest uppercase px-2 py-0.5 border ${
              returnLog.status === "PASS" ? "text-green-700 bg-green-50 border-green-200" :
              returnLog.status === "DAMAGE_NOTED" ? "text-amber-700 bg-amber-50 border-amber-200" :
              "text-red-700 bg-red-50 border-red-200"
            }`}>
              {returnLog.status.replace("_", " ")}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 mb-4">
          Document the item&apos;s condition on return. Status determines deposit outcome.
        </p>
        <ConditionLogForm
          rentalId={rental.id}
          phase="RETURN"
          existing={returnLog ? {
            ...returnLog,
            createdAt: returnLog.createdAt.toISOString(),
            updatedAt: returnLog.updatedAt.toISOString(),
          } : null}
        />

        {/* Deposit Decision */}
        {returnLog && (
          <div className={`mt-6 border p-4 ${DEPOSIT_STATUS[returnLog.status].cls}`}>
            <p className="text-xs tracking-widest uppercase font-medium mb-1">Deposit Decision</p>
            <p className="text-sm">{DEPOSIT_STATUS[returnLog.status].label}</p>
            <p className="text-xs mt-1 opacity-75">
              Deposit on file: {formatEur(rental.depositAmount)}.
              {returnLog.status === "PASS"
                ? " Release the hold in Stripe — no charge."
                : returnLog.status === "DAMAGE_NOTED"
                ? " Review damage and capture partial or full deposit."
                : " Capture the full deposit in Stripe to cover damage costs."}
            </p>
            <DepositActions
              rentalId={rental.id}
              depositAmount={rental.depositAmount}
              depositCaptured={rental.depositCaptured}
              depositRefunded={rental.depositRefunded}
              depositIntentId={rental.depositIntentId}
              waiverPurchased={rental.waiverPurchased}
              returnStatus={returnLog.status}
            />
          </div>
        )}
      </section>
    </main>
  );
}
