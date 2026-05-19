import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import type { ConditionStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Admin — Rentals" };

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending Payment", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "text-blue-700 bg-blue-50 border-blue-200" },
  ACTIVE: { label: "Active", className: "text-green-700 bg-green-50 border-green-200" },
  RETURNED: { label: "Returned", className: "text-stone-600 bg-stone-50 border-stone-200" },
  CANCELLED: { label: "Cancelled", className: "text-red-700 bg-red-50 border-red-200" },
  OVERDUE: { label: "Overdue", className: "text-orange-700 bg-orange-50 border-orange-200" },
};

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

const CONDITION_STATUS_STYLES: Record<ConditionStatus, string> = {
  PRISTINE: "text-green-700 bg-green-50 border-green-200",
  MINOR_WEAR: "text-amber-700 bg-amber-50 border-amber-200",
  DAMAGE: "text-red-700 bg-red-50 border-red-200",
  MISSING_ITEM: "text-red-900 bg-red-100 border-red-300",
};

export default async function AdminRentalsPage() {
  const rentals = await prisma.rental.findMany({
    include: {
      item: { select: { name: true, brand: true, slug: true } },
      user: { select: { email: true, name: true } },
      conditionLogs: { select: { phase: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const pendingCount = rentals.filter((r) => r.status === "PENDING").length;
  const activeCount = rentals.filter((r) => r.status === "ACTIVE" || r.status === "CONFIRMED").length;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-stone-900">Rentals</h1>
          <p className="text-sm text-stone-400 mt-1">
            {rentals.length} total · {pendingCount} pending payment · {activeCount} active
          </p>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-24 border border-stone-200 bg-white">
          <p className="text-stone-400 text-sm tracking-widest uppercase">No rentals yet</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Ref</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Customer</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Item</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Period</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Amount</th>
                <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Status</th>
                <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Condition</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => {
                const status = STATUS_LABELS[rental.status] ?? {
                  label: rental.status,
                  className: "text-stone-600 bg-stone-50 border-stone-200",
                };
                const shortRef = rental.id.slice(-8).toUpperCase();
                const dispatchLog = rental.conditionLogs.find((l) => l.phase === "DISPATCH");
                const returnLog = rental.conditionLogs.find((l) => l.phase === "RETURN");
                return (
                  <tr key={rental.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">MAR-{shortRef}</td>
                    <td className="px-4 py-3">
                      <p className="text-stone-900">{rental.user.name ?? "—"}</p>
                      <p className="text-xs text-stone-400">{rental.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/catalog/${rental.item.slug}`}
                        className="text-stone-900 hover:text-stone-600"
                        target="_blank"
                      >
                        {rental.item.name}
                      </Link>
                      <p className="text-xs text-stone-400">{rental.item.brand}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600 text-xs">
                      {rental.startDate.toLocaleDateString()} — {rental.endDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-900">{formatEur(rental.totalAmount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs tracking-widest uppercase px-2 py-0.5 border ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {dispatchLog ? (
                          <span className={`text-xs px-1.5 py-0.5 border ${CONDITION_STATUS_STYLES[dispatchLog.status]}`}>
                            D: {dispatchLog.status.replace("_", " ")}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-300">D: —</span>
                        )}
                        {returnLog ? (
                          <span className={`text-xs px-1.5 py-0.5 border ${CONDITION_STATUS_STYLES[returnLog.status]}`}>
                            R: {returnLog.status.replace("_", " ")}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-300">R: —</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/rentals/${rental.id}`}
                        className="text-xs tracking-wider uppercase text-stone-500 hover:text-stone-900 underline underline-offset-2"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
