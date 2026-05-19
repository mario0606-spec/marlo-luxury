import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ConditionLogForm from "./condition-log-form";
import DepositActions from "./deposit-actions";
import RentalStatusActions from "./rental-status-actions";
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
  ACTIVE: { label: "Dispatched", cls: "text-green-700 bg-green-50 border-green-200" },
  RETURNED: { label: "Returned", cls: "text-stone-600 bg-stone-50 border-stone-200" },
  CANCELLED: { label: "Cancelled", cls: "text-red-700 bg-red-50 border-red-200" },
  OVERDUE: { label: "Overdue", cls: "text-orange-700 bg-orange-50 border-orange-200" },
};

const CONDITION_STATUS_STYLES: Record<string, string> = {
  PRISTINE: "text-green-700 bg-green-50 border-green-200",
  MINOR_WEAR: "text-amber-700 bg-amber-50 border-amber-200",
  DAMAGE: "text-red-700 bg-red-50 border-red-200",
  MISSING_ITEM: "text-red-900 bg-red-100 border-red-300",
};

const DEPOSIT_STATUS: Record<string, { label: string; cls: string; note: string }> = {
  PRISTINE: {
    label: "Pristine — Release Deposit",
    cls: "text-green-700 bg-green-50 border-green-200",
    note: "Release the hold in Stripe — no charge.",
  },
  MINOR_WEAR: {
    label: "Minor Wear — Review Deposit",
    cls: "text-amber-700 bg-amber-50 border-amber-200",
    note: "Review and determine if any deposit capture is warranted.",
  },
  DAMAGE: {
    label: "Damage — Capture Deposit",
    cls: "text-red-700 bg-red-50 border-red-200",
    note: "Capture partial or full deposit to cover damage costs.",
  },
  MISSING_ITEM: {
    label: "Missing Item — Capture Deposit",
    cls: "text-red-900 bg-red-100 border-red-300",
    note: "Capture the full deposit for the missing item.",
  },
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

  const hasDispatchLog = !!dispatchLog && dispatchLog.photos.length >= 2;
  const hasReturnLog = !!returnLog && returnLog.photos.length >= 2;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/rentals" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700">
            Back to Rentals
          </Link>
          <h1 className="text-3xl font-light tracking-wide text-stone-900 mt-2">
            {rental.item.name}
          </h1>
          <p className="text-stone-400 text-sm mt-1">{rental.item.brand}{rental.item.referenceNumber ? ` - ${rental.item.referenceNumber}` : ""}</p>
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

      {/* Status Transitions */}
      <section className="bg-white border border-stone-200 p-6">
        <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">Status Actions</h2>
        <RentalStatusActions
          rentalId={rental.id}
          currentStatus={rental.status as "PENDING" | "CONFIRMED" | "ACTIVE" | "RETURNED" | "CANCELLED" | "OVERDUE"}
          hasDispatchLog={hasDispatchLog}
          hasReturnLog={hasReturnLog}
        />
      </section>

      {/* Side-by-Side Comparison (shown when both logs exist) */}
      {dispatchLog && returnLog && (
        <section className="bg-white border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-light tracking-wide text-stone-900">Condition Comparison</h2>
            <span className="text-xs tracking-widest uppercase text-stone-400 border border-stone-200 px-2 py-0.5">
              Dispatch vs Return
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">At Dispatch</p>
              <span className={`text-xs tracking-widest uppercase px-2 py-0.5 border inline-block mb-3 ${CONDITION_STATUS_STYLES[dispatchLog.status] ?? "text-stone-600 bg-stone-50 border-stone-200"}`}>
                {dispatchLog.status.replace("_", " ")}
              </span>
              <div className="grid grid-cols-2 gap-1">
                {dispatchLog.photos.slice(0, 4).map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Dispatch photo ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">At Return</p>
              <span className={`text-xs tracking-widest uppercase px-2 py-0.5 border inline-block mb-3 ${CONDITION_STATUS_STYLES[returnLog.status] ?? "text-stone-600 bg-stone-50 border-stone-200"}`}>
                {returnLog.status.replace("_", " ")}
              </span>
              <div className="grid grid-cols-2 gap-1">
                {returnLog.photos.slice(0, 4).map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Return photo ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dispatch Condition Log */}
      <section className="bg-white border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-light tracking-wide text-stone-900">Dispatch Condition</h2>
          <span className="text-xs tracking-widest uppercase text-stone-400 border border-stone-200 px-2 py-0.5">
            Before Dispatch
          </span>
          {dispatchLog && (
            <span className={`text-xs tracking-widest uppercase px-2 py-0.5 border ${
              CONDITION_STATUS_STYLES[dispatchLog.status] ?? "text-stone-600 bg-stone-50 border-stone-200"
            }`}>
              {dispatchLog.status.replace("_", " ")}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 mb-4">
          Document the item condition before it leaves the warehouse. Minimum 2 photos required.
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
              CONDITION_STATUS_STYLES[returnLog.status] ?? "text-stone-600 bg-stone-50 border-stone-200"
            }`}>
              {returnLog.status.replace("_", " ")}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 mb-4">
          Document the item condition on return. Minimum 2 photos required. Assessment determines deposit outcome.
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
        {returnLog && DEPOSIT_STATUS[returnLog.status] && (
          <div className={`mt-6 border p-4 ${DEPOSIT_STATUS[returnLog.status].cls}`}>
            <p className="text-xs tracking-widest uppercase font-medium mb-1">Deposit Decision</p>
            <p className="text-sm">{DEPOSIT_STATUS[returnLog.status].label}</p>
            <p className="text-xs mt-1 opacity-75">
              Deposit on file: {formatEur(rental.depositAmount)}. {DEPOSIT_STATUS[returnLog.status].note}
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
