import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminDeleteButton } from "./delete-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Items" };

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminItemsPage() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      category: true,
      dailyRate: true,
      available: true,
      featured: true,
      images: true,
    },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-stone-900">
            Catalog Items
          </h1>
          <p className="text-sm text-stone-400 mt-1">{items.length} items</p>
        </div>
        <Link href="/admin/items/new" className="btn-primary">
          + Add Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 border border-stone-200 bg-white">
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-4">
            No items yet
          </p>
          <Link href="/admin/items/new" className="btn-outline">
            Add Your First Item
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal w-16">
                  Image
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Item
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Category
                </th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Daily Rate
                </th>
                <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 relative bg-stone-100 overflow-hidden">
                      {item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-100" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-400">{item.brand}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600 text-xs tracking-widest uppercase">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 text-right text-stone-900">
                    {formatEur(item.dailyRate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                          item.available
                            ? "text-green-700 bg-green-50"
                            : "text-stone-400 bg-stone-100"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                      {item.featured && (
                        <span className="text-xs tracking-widest uppercase text-amber-600 bg-amber-50 px-2 py-0.5">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/catalog/${item.slug}`}
                        className="text-xs text-stone-400 hover:text-stone-600 tracking-wide"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="text-xs text-stone-600 hover:text-stone-900 tracking-wide"
                      >
                        Edit
                      </Link>
                      <AdminDeleteButton itemId={item.id} itemName={item.name} />
                    </div>
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
