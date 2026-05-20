import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { NavServer as Nav } from "@/components/nav-server";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Nav />

      <main id="main-content" className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-light tracking-wide mb-8">
          Welcome, {session.user.name ?? "Guest"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Rentals", value: "0", href: "/dashboard/rentals" },
            { label: "Favorites", value: "0", href: "/dashboard/favorites" },
            { label: "Subscription", value: "None", href: "/dashboard/subscription" },
            { label: "Orders", value: "0", href: "/dashboard/orders" },
          ].map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-stone-200 p-8 hover:border-stone-400 transition-colors"
            >
              <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">
                {card.label}
              </p>
              <p className="text-3xl font-light">{card.value}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 border-t border-stone-200 pt-8">
          <h2 className="text-sm tracking-widest uppercase text-stone-500 mb-6">
            Quick Actions
          </h2>
          <div className="flex gap-4">
            <Link href="/catalog" className="btn-primary">
              Browse Collection
            </Link>
            <Link href="/dashboard/subscription" className="btn-outline">
              Manage Subscription
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
