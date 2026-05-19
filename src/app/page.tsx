import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl tracking-widest font-light uppercase">
            Marlo
          </span>
          <div className="flex items-center gap-6 text-sm tracking-wider uppercase">
            <Link href="/catalog" className="text-stone-600 hover:text-stone-900">
              Collection
            </Link>
            {session ? (
              <Link href="/dashboard" className="text-stone-600 hover:text-stone-900">
                My Account
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="text-stone-600 hover:text-stone-900">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary py-2">
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-32 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-500 mb-6">
          Luxury Made Accessible
        </p>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-900 mb-8">
          Wear Extraordinary
        </h1>
        <p className="text-lg text-stone-500 max-w-xl mx-auto mb-12">
          Rent iconic watches, fine jewelry, and luxury accessories for any occasion —
          from a single evening to a monthly subscription.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/catalog" className="btn-primary">
            Browse Collection
          </Link>
          <Link href="/auth/signup" className="btn-outline">
            Subscribe
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-stone-200 bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Watches", desc: "Rolex, Patek Philippe, Audemars Piguet, and more." },
              { label: "Jewelry", desc: "Cartier, Van Cleef & Arpels, Bulgari, and more." },
              { label: "Subscriptions", desc: "Receive a curated piece each month — Basic, Premium, or VIP." },
            ].map((cat) => (
              <div key={cat.label} className="border border-stone-200 p-8">
                <h3 className="text-sm tracking-widest uppercase font-medium mb-3">
                  {cat.label}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs tracking-wider text-stone-400 uppercase">
          © {new Date().getFullYear()} Marlo Luxury Rentals
        </div>
      </footer>
    </main>
  );
}
