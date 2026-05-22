import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/auth/signin");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl tracking-widest font-light uppercase">
              marianni
            </Link>
            <span className="text-xs tracking-widest uppercase text-stone-400 border border-stone-200 px-2 py-1">
              Admin
            </span>
            <div className="flex items-center gap-6 text-sm tracking-wider uppercase text-stone-600">
              <Link href="/admin/items" className="hover:text-stone-900">
                Items
              </Link>
              <Link href="/admin/rentals" className="hover:text-stone-900">
                Rentals
              </Link>
              <Link href="/catalog" className="hover:text-stone-900">
                View Catalog
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400">{session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-xs tracking-wider uppercase text-stone-600 hover:text-stone-900"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
