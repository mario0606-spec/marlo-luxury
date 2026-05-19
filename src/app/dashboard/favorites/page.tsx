import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { ItemCard } from "@/components/item-card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Favorites" };

export default async function FavoritesPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      item: {
        select: {
          id: true,
          slug: true,
          name: true,
          brand: true,
          category: true,
          dailyRate: true,
          weeklyRate: true,
          images: true,
          available: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <nav className="mb-4 flex items-center gap-2 text-xs tracking-widest uppercase text-stone-400">
            <Link href="/dashboard" className="hover:text-stone-600">Account</Link>
            <span>/</span>
            <span className="text-stone-600">Favorites</span>
          </nav>
          <h1 className="text-4xl font-light tracking-tight text-stone-900">My Favorites</h1>
          {favorites.length > 0 && (
            <p className="text-xs text-stone-400 tracking-widest uppercase mt-2">
              {favorites.length} {favorites.length === 1 ? "piece" : "pieces"} saved
            </p>
          )}
        </header>

        {favorites.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-stone-400 text-sm tracking-widest uppercase mb-6">
              No favorites yet
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-stone-900 text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <ItemCard key={fav.item.id} item={fav.item} isFavorited={true} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs tracking-wider text-stone-400 uppercase">
          © {new Date().getFullYear()} Marlo Luxury Rentals
        </div>
      </footer>
    </div>
  );
}
