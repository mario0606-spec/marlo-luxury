import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/stripe";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending Payment", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  PAID: { label: "Paid", className: "bg-green-50 text-green-700 border-green-200" },
  FULFILLED: { label: "Fulfilled", className: "bg-blue-50 text-blue-700 border-blue-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
  REFUNDED: { label: "Refunded", className: "bg-stone-50 text-stone-600 border-stone-200" },
};

export default async function OrdersPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { item: { select: { name: true, brand: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">Marlo</Link>
          <Link href="/dashboard" className="text-sm tracking-wider text-stone-500 hover:text-stone-900">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-light tracking-wide mb-10">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-300">
            <p className="text-stone-400 mb-6">No orders yet</p>
            <Link href="/catalog" className="btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? {
                label: order.status,
                className: "bg-stone-50 text-stone-600 border-stone-200",
              };

              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 p-6 flex items-start justify-between gap-6"
                >
                  <div>
                    <p className="text-xs text-stone-400 mb-2">
                      Order #{order.id.slice(-8).toUpperCase()} · {order.createdAt.toLocaleDateString()}
                    </p>
                    <div className="space-y-1">
                      {order.items.map((oi) => (
                        <p key={oi.id} className="text-sm text-stone-700">
                          {oi.quantity}× {oi.item.name}{" "}
                          <span className="text-stone-400">({oi.item.brand})</span>
                          {" — "}{formatCents(oi.unitPrice)}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 border ${status.className}`}>
                      {status.label}
                    </span>
                    <p className="text-sm font-medium">{formatCents(order.totalAmount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
