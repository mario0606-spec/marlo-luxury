import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/stripe";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending Payment", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-50 text-blue-700 border-blue-200" },
  DISPATCHED: { label: "On Its Way", className: "bg-purple-50 text-purple-700 border-purple-200" },
  ACTIVE: { label: "Active", className: "bg-green-50 text-green-700 border-green-200" },
  RETURNED: { label: "Returned", className: "bg-stone-50 text-stone-600 border-stone-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
  OVERDUE: { label: "Overdue", className: "bg-orange-50 text-orange-700 border-orange-200" },
};

export default async function RentalsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const rentals = await prisma.rental.findMany({
    where: { userId },
    include: {
      item: { select: { name: true, brand: true, images: true, slug: true } },
      conditionLogs: {
        where: { type: "DISPATCH" },
        select: { photos: true, capturedAt: true },
      },
    },
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
        <h1 className="text-3xl font-light tracking-wide mb-10">My Rentals</h1>

        {rentals.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-300">
            <p className="text-stone-400 mb-6">No rentals yet</p>
            <Link href="/catalog" className="btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => {
              const status = STATUS_LABELS[rental.status] ?? {
                label: rental.status,
                className: "bg-stone-50 text-stone-600 border-stone-200",
              };
              const days = Math.ceil(
                (rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              const dispatchLog = rental.conditionLogs[0];

              return (
                <div key={rental.id} className="bg-white border border-stone-200 p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-4 items-start">
                      {rental.item.images[0] && (
                        <div className="w-16 h-16 flex-shrink-0 bg-stone-100 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rental.item.images[0]}
                            alt={rental.item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-stone-900">{rental.item.name}</p>
                        <p className="text-sm text-stone-500">{rental.item.brand}</p>
                        <p className="text-xs text-stone-400 mt-1">
                          {rental.startDate.toLocaleDateString()} – {rental.endDate.toLocaleDateString()}
                          {" "}({days} day{days !== 1 ? "s" : ""})
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 border ${status.className}`}>
                        {status.label}
                      </span>
                      <p className="text-sm font-medium">{formatCents(rental.totalAmount)}</p>
                      <p className="text-xs text-stone-400">incl. {formatCents(rental.depositAmount)} deposit</p>
                    </div>
                  </div>

                  {/* Dispatch condition photos */}
                  {dispatchLog && (
                    <div className="border-t border-stone-100 mt-4 pt-4">
                      <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
                        Item condition at dispatch
                      </p>
                      <div className="flex gap-2 overflow-x-auto">
                        {dispatchLog.photos.slice(0, 4).map((photo: string, idx: number) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={idx}
                            src={photo}
                            alt={`Condition photo ${idx + 1}`}
                            className="w-20 h-20 object-cover flex-shrink-0 border border-stone-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
