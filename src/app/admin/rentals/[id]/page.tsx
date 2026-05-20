import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ConditionLogPanel } from "./ConditionLogPanel";

export const metadata: Metadata = { title: "Admin — Rental Detail" };

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
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(
    cents / 100
  );
}

export default async function AdminRentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      item: { select: { name: true, brand: true, slug: true, referenceNumber: true } },
      conditionLogs: { orderBy: { capturedAt: "asc" } },
    },
  });

  if (!rental) notFound();

  const status = STATUS_LABELS[rental.status] ?? {
    label: rental.status,
    className: "text-stone-600 bg-stone-50 border-stone-200",
  };

  const dispatchLog = rental.conditionLogs.find((l: { type: string }) => l.type === "DISPATCH") as typeof rental.conditionLogs[0] | undefined;
  const returnLog = rental.conditionLogs.find((l: { type: string }) => l.type === "RETURN") as typeof rental.conditionLogs[0] | undefined;
  const shortRef = rental.id.slice(-8).toUpperCase();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/admin/rentals" className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-600">
          ← Rentals
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-stone-900">
              {rental.item.brand} {rental.item.name}
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              MAR-{shortRef} · {rental.user.name ?? rental.user.email}
            </p>
          </div>
          <span className={`text-xs tracking-widest uppercase px-3 py-1 border ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Rental info */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-stone-200 bg-white p-6">
          <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">Rental Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Period</dt>
              <dd className="text-stone-900">
                {rental.startDate.toLocaleDateString()} — {rental.endDate.toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Total</dt>
              <dd className="text-stone-900">{formatEur(rental.totalAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Deposit</dt>
              <dd className="text-stone-900">{formatEur(rental.depositAmount)}</dd>
            </div>
            {rental.item.referenceNumber && (
              <div className="flex justify-between">
                <dt className="text-stone-500">Reference</dt>
                <dd className="text-stone-900 font-mono text-xs">{rental.item.referenceNumber}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border border-stone-200 bg-white p-6">
          <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">Customer</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Name</dt>
              <dd className="text-stone-900">{rental.user.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Email</dt>
              <dd className="text-stone-900">{rental.user.email}</dd>
            </div>
            {rental.shippingAddress && (
              <div className="flex justify-between">
                <dt className="text-stone-500">Ship to</dt>
                <dd className="text-stone-900 text-right">
                  {((rental.shippingAddress as Record<string, string>).fullName)}<br />
                  {((rental.shippingAddress as Record<string, string>).addressLine1)}<br />
                  {((rental.shippingAddress as Record<string, string>).postalCode)} {((rental.shippingAddress as Record<string, string>).city)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* DHL Express shipping info */}
      {(rental.dhlOutboundTrackingNumber || rental.dhlReturnTrackingNumber) && (
        <div className="border border-stone-200 bg-white p-6 mb-8">
          <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">DHL Express Shipment</h2>
          <div className="grid grid-cols-2 gap-6 text-sm">
            {rental.dhlOutboundTrackingNumber && (
              <div>
                <p className="text-stone-500 mb-1">Outbound tracking</p>
                <a
                  href={`https://www.dhl.com/de-de/home/tracking/tracking-parcel.html?submit=1&tracking-id=${rental.dhlOutboundTrackingNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-stone-900 underline underline-offset-2 hover:text-stone-600"
                >
                  {rental.dhlOutboundTrackingNumber}
                </a>
                {rental.dhlOutboundLabelUrl && (
                  <a
                    href={rental.dhlOutboundLabelUrl}
                    download={`label-outbound-${rental.id}.pdf`}
                    className="ml-4 text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700"
                  >
                    Download label
                  </a>
                )}
              </div>
            )}
            {rental.dhlReturnTrackingNumber && (
              <div>
                <p className="text-stone-500 mb-1">Return (Retoure) tracking</p>
                <a
                  href={`https://www.dhl.com/de-de/home/tracking/tracking-parcel.html?submit=1&tracking-id=${rental.dhlReturnTrackingNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-stone-900 underline underline-offset-2 hover:text-stone-600"
                >
                  {rental.dhlReturnTrackingNumber}
                </a>
                {rental.dhlReturnLabelUrl && (
                  <a
                    href={rental.dhlReturnLabelUrl}
                    download={`label-return-${rental.id}.pdf`}
                    className="ml-4 text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700"
                  >
                    Download label
                  </a>
                )}
              </div>
            )}
          </div>
          {rental.dhlShipmentCreatedAt && (
            <p className="text-xs text-stone-400 mt-4">
              Labels generated {new Date(rental.dhlShipmentCreatedAt).toLocaleString("de-DE")}
            </p>
          )}
        </div>
      )}

      {/* Condition log panel — client component */}
      <ConditionLogPanel
        rentalId={rental.id}
        status={rental.status}
        dispatchLog={dispatchLog ? {
          id: dispatchLog.id,
          photos: dispatchLog.photos,
          notes: dispatchLog.notes,
          capturedAt: dispatchLog.capturedAt.toISOString(),
        } : null}
        returnLog={returnLog ? {
          id: returnLog.id,
          photos: returnLog.photos,
          notes: returnLog.notes,
          assessment: returnLog.assessment,
          capturedAt: returnLog.capturedAt.toISOString(),
        } : null}
      />
    </main>
  );
}
