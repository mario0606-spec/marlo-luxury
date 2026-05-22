import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/stripe";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  PAID: { label: "Paid", className: "bg-green-50 text-green-700 border-green-200" },
  FULFILLED: { label: "Fulfilled", className: "bg-blue-50 text-blue-700 border-blue-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
  REFUNDED: { label: "Refunded", className: "bg-stone-50 text-stone-600 border-stone-200" },
};

const RENTAL_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending Payment", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-50 text-green-700 border-green-200" },
  ACTIVE: { label: "Active", className: "bg-blue-50 text-blue-700 border-blue-200" },
  RETURNED: { label: "Returned", className: "bg-stone-50 text-stone-600 border-stone-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
  OVERDUE: { label: "Overdue", className: "bg-orange-50 text-orange-700 border-orange-200" },
};

export default async function AdminOrdersPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id) redirect("/auth/signin");
  if (user.role !== "ADMIN") notFound();

  const [orders, rentals] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { item: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.rental.findMany({
      include: {
        user: { select: { email: true, name: true } },
        item: { select: { name: true, brand: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">marianni Admin</Link>
          <Link href="/dashboard" className="text-sm tracking-wider text-stone-500 hover:text-stone-900">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Rentals */}
        <section>
          <h2 className="text-2xl font-light tracking-wide mb-6">Rentals ({rentals.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white border border-stone-200">
              <thead>
                <tr className="border-b border-stone-100 text-xs tracking-widest uppercase text-stone-500">
                  <th className="text-left px-4 py-3">Item</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Dates</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Stripe PI</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => {
                  const s = RENTAL_STATUS_LABELS[r.status];
                  return (
                    <tr key={r.id} className="border-b border-stone-50 hover:bg-stone-50">
                      <td className="px-4 py-3 font-medium">{r.item.name}</td>
                      <td className="px-4 py-3 text-stone-500">{r.user.email}</td>
                      <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                        {r.startDate.toLocaleDateString()} – {r.endDate.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{formatCents(r.totalAmount)}</td>
                      <td className="px-4 py-3">
                        {s && (
                          <span className={`text-xs px-2 py-0.5 border ${s.className}`}>
                            {s.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-400 font-mono text-xs">
                        {r.stripePaymentId ? r.stripePaymentId.slice(0, 20) + "…" : "—"}
                      </td>
                    </tr>
                  );
                })}
                {rentals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-stone-400">No rentals</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Orders */}
        <section>
          <h2 className="text-2xl font-light tracking-wide mb-6">Orders ({orders.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white border border-stone-200">
              <thead>
                <tr className="border-b border-stone-100 text-xs tracking-widest uppercase text-stone-500">
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Items</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const s = STATUS_LABELS[o.status];
                  return (
                    <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50">
                      <td className="px-4 py-3 font-mono text-xs text-stone-400">
                        #{o.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-stone-500">{o.user.email}</td>
                      <td className="px-4 py-3 text-stone-500">
                        {o.items.map((oi) => oi.item.name).join(", ")}
                      </td>
                      <td className="px-4 py-3">{formatCents(o.totalAmount)}</td>
                      <td className="px-4 py-3">
                        {s && (
                          <span className={`text-xs px-2 py-0.5 border ${s.className}`}>
                            {s.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-400 whitespace-nowrap">
                        {o.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-stone-400">No orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
