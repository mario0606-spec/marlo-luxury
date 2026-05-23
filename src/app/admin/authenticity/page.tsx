import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Authenticity Records" };

export default async function AdminAuthenticityPage() {
  const records = await prisma.watchAuthenticity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      item: {
        select: { id: true, name: true, brand: true, slug: true, images: true },
      },
    },
  });

  const itemsWithoutAuth = await prisma.item.findMany({
    where: { authenticity: null },
    select: { id: true, name: true, brand: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-stone-900">
            Authenticity Records
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            {records.length} authenticated · {itemsWithoutAuth.length} pending
          </p>
        </div>
      </div>

      {/* Items needing authentication */}
      {itemsWithoutAuth.length > 0 && (
        <div className="mb-8 border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs tracking-widest uppercase text-amber-800 mb-2">
            Awaiting Authentication
          </p>
          <div className="flex flex-wrap gap-2">
            {itemsWithoutAuth.map((item) => (
              <span
                key={item.id}
                className="inline-block text-xs bg-white border border-amber-200 px-2 py-1 text-stone-700"
              >
                {item.brand} — {item.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-24 border border-stone-200 bg-white">
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-4">
            No authenticity records yet
          </p>
          <p className="text-stone-500 text-sm">
            Use the API to create records: POST /api/admin/authenticity
          </p>
        </div>
      ) : (
        <div className="border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Watch
                </th>
                <th className="px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Serial
                </th>
                <th className="px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Watchmaker
                </th>
                <th className="px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Status
                </th>
                <th className="px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Video
                </th>
                <th className="px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  NFC
                </th>
                <th className="px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/catalog/${rec.item.slug}`}
                      className="text-stone-900 hover:underline"
                    >
                      {rec.item.brand} {rec.item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-600">
                    {rec.serialNumber}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{rec.watchmaker}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {rec.inspectionVideoUrl ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {rec.nfcUid ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/verify/${encodeURIComponent(rec.serialNumber)}`}
                      className="text-xs text-stone-500 hover:text-stone-900 underline"
                    >
                      View cert
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-800 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-800 border-amber-200",
    REVOKED: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase border rounded-sm ${
        styles[status] ?? "bg-stone-50 text-stone-600 border-stone-200"
      }`}
    >
      {status}
    </span>
  );
}
