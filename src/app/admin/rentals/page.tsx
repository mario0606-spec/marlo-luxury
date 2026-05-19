import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Rentals" };

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending Payment", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "text-blue-700 bg-blue-50 border-blue-200" },
  DISPATCHED: { label: "Dispatched", className: "text-purple-700 bg-purple-50 border-purple-200" },
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

export default async function AdminRentalsPage() {
  const rentals = await prisma.rental.findMany({
    include: {
      item: { select: { name: true, brand: true, slug: true } },
      user: { select: { email: true, name: true } },
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
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => {
                const status = STATUS_LABELS[rental.status] ?? {
                  label: rental.status,
                  className: "text-stone-600 bg-stone-50 border-stone-200",
                };
                const shortRef = rental.id.slice(-8).toUpperCase();
                return (
                  <tr key={rental.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">
                      <Link href={`/admin/rentals/${rental.id}`} className="hover:text-stone-800 underline underline-offset-2">
                        MAR-{shortRef}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-stone-900">{rental.user.name ?? "—"}</p>
                      <p className="text-xs text-stone-400">{rental.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/rentals/${rental.id}`}
                        className="text-stone-900 hover:text-stone-600"
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
