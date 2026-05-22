import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Favorites" };

export default async function AdminFavoritesPage() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const favorites = await prisma.favorite.groupBy({
    by: ["itemId"],
    _count: { itemId: true },
    orderBy: { _count: { itemId: "desc" } },
    take: 50,
  });

  const itemIds = favorites.map((f) => f.itemId);
  const items = await prisma.item.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, name: true, brand: true, slug: true, available: true },
  });

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const rows = favorites
    .map((f) => ({ item: itemMap.get(f.itemId), count: f._count.itemId }))
    .filter((r) => r.item);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light tracking-tight text-stone-900">Most Favorited Items</h1>
      </div>

      <div className="bg-white border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-500 font-medium">Item</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-500 font-medium">Brand</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-stone-500 font-medium">Status</th>
              <th className="text-right px-6 py-3 text-xs tracking-widest uppercase text-stone-500 font-medium">Favorites</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ item, count }) => (
              <tr key={item!.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="px-6 py-4">
                  <Link href={`/catalog/${item!.slug}`} className="text-stone-900 hover:underline">
                    {item!.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-stone-600">{item!.brand}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      item!.available
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item!.available ? "Available" : "Rented out"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-stone-900">{count}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-stone-400 text-xs tracking-widest uppercase">
                  No favorites yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
