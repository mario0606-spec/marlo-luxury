import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Marlo — Wear Luxury. Pay Per Occasion.",
  description:
    "Rent iconic watches and fine jewelry from the world's finest brands. Flexible daily, weekly, or monthly rentals. Rolex, Patek Philippe, Cartier, and more.",
  keywords: [
    "luxury rentals",
    "watch rental",
    "jewelry rental",
    "Rolex rental",
    "Cartier rental",
    "luxury accessories",
  ],
  openGraph: {
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic watches and fine jewelry from the world's finest brands. Starting from one occasion.",
    type: "website",
    siteName: "Marlo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marlo — Wear Luxury. Pay Per Occasion.",
    description:
      "Rent iconic watches and fine jewelry from the world's finest brands.",
  },
};

export default async function LandingPage() {
  const session = await auth();

  return (
    <main className="bg-stone-50 overflow-x-hidden">
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-stone-900/95 backdrop-blur-sm"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-white text-xl tracking-[0.35em] font-light uppercase focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-stone-900"
              aria-label="Marlo home"
            >
              Marlo
            </Link>

            <div className="flex items-center gap-6 text-sm tracking-widest uppercase">
              <Link
                href="#how-it-works"
                className="text-stone-300 hover:text-white transition-colors hidden md:block focus:outline-none focus:underline"
              >
                How It Works
              </Link>
              <Link
                href="#collection"
                className="text-stone-300 hover:text-white transition-colors hidden md:block focus:outline-none focus:underline"
              >
                Collection
              </Link>

              {session ? (
                <Link
                  href="/dashboard"
                  className="text-stone-300 hover:text-white transition-colors text-sm tracking-widest uppercase focus:outline-none focus:underline"
                >
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-stone-300 hover:text-white transition-colors hidden sm:block focus:outline-none focus:underline"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="#waitlist"
                    className="bg-gold-500 hover:bg-gold-400 text-stone-900 px-5 py-2 text-xs font-medium tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-gold-300"
                  >
                    Join Waitlist
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center bg-stone-900 overflow-hidden"
        aria-label="Hero — Wear Luxury, Pay Per Occasion"
      >
        {/* Background glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800/70 to-stone-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-gold-400/4 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] bg-gold-300/4 rounded-full blur-2xl pointer-events-none" />

        {/* Decorative horizontal rule */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/3 pointer-events-none" />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.45em] uppercase mb-10 font-light">
            Luxury Watches &amp; Jewelry · Rental Marketplace
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light text-white tracking-tight leading-[1.04] mb-8">
            Wear Luxury.
            <br />
            <span className="text-gold-400">Pay Per Occasion.</span>
          </h1>

          <p className="text-stone-300/80 text-lg sm:text-xl max-w-2xl mx-auto mb-14 leading-relaxed font-light">
            Rent iconic watches and fine jewelry from the world's most prestigious
            brands — for a wedding, gala, or any moment that deserves the extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#waitlist"
              className="bg-gold-500 hover:bg-gold-400 text-stone-900 px-10 py-4 text-sm font-medium tracking-widest uppercase transition-colors w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-gold-300"
            >
              Get Early Access
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white/25 hover:border-white/60 text-white/80 hover:text-white px-10 py-4 text-sm tracking-widest uppercase transition-colors w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-20 flex items-center justify-center gap-10 text-stone-500">
            {[
              ["Rolex", "Watches"],
              ["Patek Philippe", "Watches"],
              ["Cartier", "Jewelry"],
              ["Van Cleef", "Jewelry"],
            ].map(([brand, cat]) => (
              <div key={brand} className="text-center hidden sm:block">
                <p className="text-xs text-stone-300/60 tracking-wider">{brand}</p>
                <p className="text-[0.6rem] text-stone-600 tracking-widest uppercase mt-0.5">{cat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" aria-hidden="true">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-stone-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-stone-500/50" />
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-28 lg:py-36 bg-white"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-500 text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
              The Experience
            </p>
            <h2
              id="how-it-works-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight"
            >
              Luxury in Three Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                num: "01",
                title: "Browse",
                desc: "Explore our curated selection of Rolex, Patek Philippe, Cartier, Van Cleef & Arpels, and more — every piece authenticated and insured.",
              },
              {
                num: "02",
                title: "Book",
                desc: "Choose your dates and rental period. Pay securely online. We deliver in discreet, luxury packaging directly to your address.",
              },
              {
                num: "03",
                title: "Wear",
                desc: "Enjoy the piece for your occasion. When done, we arrange a seamless insured pickup — no commitment, no hassle.",
              },
            ].map((step) => (
              <div key={step.num} className="border-t-2 border-stone-100 pt-10">
                <span
                  className="text-7xl font-light text-stone-100 leading-none block mb-8 select-none"
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <h3 className="text-sm tracking-[0.3em] uppercase font-medium text-stone-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection Showcase ─────────────────────────────────────────────── */}
      <section
        id="collection"
        className="py-28 lg:py-36 bg-stone-50"
        aria-labelledby="collection-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-500 text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
              The Collection
            </p>
            <h2
              id="collection-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight"
            >
              Iconic Pieces, Every Occasion
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Watches card */}
            <div
              className="relative overflow-hidden bg-stone-900 aspect-[5/4] group"
              role="img"
              aria-label="Luxury watches collection"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950" />
              {/* Gold glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-gold-500/8 rounded-full blur-3xl pointer-events-none" />
              {/* Watch face circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-gold-500/20" aria-hidden="true" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-gold-500/12" aria-hidden="true" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-gold-500/8" aria-hidden="true" />
              {/* Watch hands */}
              <div
                className="absolute top-1/2 left-1/2 w-px h-14 bg-gold-400/30 origin-bottom -translate-x-1/2 -rotate-12"
                style={{ marginTop: "-3.5rem" }}
                aria-hidden="true"
              />
              <div
                className="absolute top-1/2 left-1/2 w-px h-10 bg-gold-300/25 origin-bottom -translate-x-1/2 rotate-45"
                style={{ marginTop: "-2.5rem" }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
                <p className="text-gold-400 text-[0.6rem] tracking-[0.4em] uppercase mb-3 font-light">
                  Timepieces
                </p>
                <h3 className="text-white text-2xl sm:text-3xl font-light tracking-wide mb-4">
                  Watches
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {["Rolex", "Patek Philippe", "Audemars Piguet", "Richard Mille"].map((b) => (
                    <span key={b} className="text-stone-400 text-xs tracking-wider">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Jewelry card */}
            <div
              className="relative overflow-hidden bg-stone-900 aspect-[5/4] group"
              role="img"
              aria-label="Fine jewelry collection"
            >
              <div className="absolute inset-0 bg-gradient-to-tl from-stone-800 via-stone-900 to-stone-950" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-gold-400/7 rounded-full blur-3xl pointer-events-none" />
              {/* Diamond / facet pattern */}
              <div
                className="absolute top-1/2 left-1/2 w-36 h-36 border border-gold-500/20 rotate-45"
                style={{ marginTop: "-4.5rem", marginLeft: "-4.5rem" }}
                aria-hidden="true"
              />
              <div
                className="absolute top-1/2 left-1/2 w-24 h-24 border border-gold-500/12 rotate-45"
                style={{ marginTop: "-3rem", marginLeft: "-3rem" }}
                aria-hidden="true"
              />
              <div
                className="absolute top-1/2 left-1/2 w-12 h-12 bg-gold-500/8 rotate-45"
                style={{ marginTop: "-1.5rem", marginLeft: "-1.5rem" }}
                aria-hidden="true"
              />
              {/* Corner facet lines */}
              <div
                className="absolute top-1/2 left-1/2 w-48 h-px bg-gold-400/10"
                style={{ marginTop: 0, marginLeft: "-6rem", transform: "rotate(45deg)" }}
                aria-hidden="true"
              />
              <div
                className="absolute top-1/2 left-1/2 w-48 h-px bg-gold-400/8"
                style={{ marginTop: 0, marginLeft: "-6rem", transform: "rotate(-45deg)" }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
                <p className="text-gold-400 text-[0.6rem] tracking-[0.4em] uppercase mb-3 font-light">
                  Fine Jewelry
                </p>
                <h3 className="text-white text-2xl sm:text-3xl font-light tracking-wide mb-4">
                  Jewelry
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {["Cartier", "Van Cleef & Arpels", "Bulgari", "Tiffany & Co."].map((b) => (
                    <span key={b} className="text-stone-400 text-xs tracking-wider">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription teaser */}
          <div className="mt-5 bg-white border border-stone-200 p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-gold-500 text-[0.65rem] tracking-[0.4em] uppercase mb-2 font-light">
                  Subscriptions
                </p>
                <h3 className="text-stone-900 text-xl sm:text-2xl font-light tracking-wide">
                  A new luxury piece, every month
                </h3>
                <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                  Basic · Premium · VIP — curated selections delivered to your door on a recurring basis.
                </p>
              </div>
              <Link href="#waitlist" className="btn-outline shrink-0">
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Promise ──────────────────────────────────────────────────── */}
      <section className="py-28 lg:py-36 bg-white" aria-label="Our promises">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 text-center">
            {[
              {
                title: "Authenticated",
                desc: "Every piece verified by certified experts. You are always wearing the genuine article, with full documentation.",
              },
              {
                title: "Fully Insured",
                desc: "All rentals are covered by comprehensive insurance policies. Wear with complete confidence and peace of mind.",
              },
              {
                title: "White-Glove Delivery",
                desc: "Discreet luxury packaging, secure delivery and pickup — all arranged on your schedule, at your door.",
              },
            ].map((item) => (
              <div key={item.title} className="px-4 flex flex-col items-center">
                <div className="w-px h-10 bg-gold-300 mb-8" aria-hidden="true" />
                <h3 className="text-xs tracking-[0.35em] uppercase font-medium text-stone-900 mb-5">
                  {item.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press / Social Proof ───────────────────────────────────────────── */}
      <section
        className="py-16 bg-stone-50 border-y border-stone-200"
        aria-label="Press coverage"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-stone-400 text-[0.6rem] tracking-[0.45em] uppercase mb-10">
            As Featured In · Coming Soon
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-8 lg:gap-16"
            role="list"
            aria-label="Press outlets"
          >
            {["Vogue", "Forbes", "GQ", "Harper's Bazaar", "Financial Times"].map((pub) => (
              <span
                key={pub}
                className="text-stone-300 text-sm tracking-[0.25em] uppercase font-light"
                role="listitem"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section
        className="py-28 lg:py-36 bg-white"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-500 text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
              Early Members
            </p>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight"
            >
              Loved Before Launch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Finally, a way to wear the Rolex I've always dreamed of — for my wedding day, without a life-changing purchase.",
                name: "S.K.",
                detail: "Early member",
              },
              {
                quote:
                  "Marlo made it possible to surprise my wife with her dream Cartier bracelet for our anniversary. Effortless.",
                name: "M.L.",
                detail: "Early member",
              },
              {
                quote:
                  "The subscription model is brilliant. A different iconic timepiece every month. I'm completely hooked.",
                name: "A.P.",
                detail: "Early member",
              },
            ].map((t, i) => (
              <article
                key={i}
                className="bg-stone-50 border border-stone-100 p-8 flex flex-col"
              >
                <div
                  className="text-gold-300 text-3xl leading-none mb-5 font-serif select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <p className="text-stone-600 text-sm leading-relaxed italic flex-1 mb-8">
                  {t.quote}
                </p>
                <div>
                  <p className="text-stone-900 text-sm font-medium">{t.name}</p>
                  <p className="text-stone-400 text-[0.65rem] tracking-widest uppercase mt-1">
                    {t.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist CTA ───────────────────────────────────────────────────── */}
      <section
        id="waitlist"
        className="relative py-32 lg:py-44 bg-stone-900 overflow-hidden"
        aria-labelledby="waitlist-heading"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800/60 to-stone-950 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto text-center px-4 sm:px-6">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.45em] uppercase mb-6 font-light">
            Early Access
          </p>
          <h2
            id="waitlist-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight mb-6 leading-tight"
          >
            Be the First
            <br />
            to Wear Marlo
          </h2>
          <p className="text-stone-300/70 text-lg mb-12 leading-relaxed font-light">
            We are launching soon. Join the waitlist for early access, founding member
            pricing, and a curated first look at the collection.
          </p>

          <WaitlistForm source="homepage" />

          <p className="text-stone-600 text-xs mt-5 tracking-wide">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-stone-950 py-16 lg:py-20" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="text-white text-xl tracking-[0.35em] font-light uppercase block mb-5 focus:outline-none focus:underline"
                aria-label="Marlo home"
              >
                Marlo
              </Link>
              <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                Luxury watches and fine jewelry, accessible for every occasion — daily rental to monthly subscription.
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-stone-500 text-[0.6rem] tracking-[0.4em] uppercase mb-6">
                Company
              </h4>
              <ul className="space-y-3" role="list">
                {[
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "The Collection", href: "#collection" },
                  { label: "Join Waitlist", href: "#waitlist" },
                  { label: "Sign In", href: "/auth/signin" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-stone-400 hover:text-white text-sm transition-colors focus:outline-none focus:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-stone-500 text-[0.6rem] tracking-[0.4em] uppercase mb-6">
                Follow Us
              </h4>
              <ul className="space-y-3" role="list">
                {[
                  { label: "Instagram", href: "#" },
                  { label: "TikTok", href: "#" },
                  { label: "LinkedIn", href: "#" },
                  { label: "WhatsApp", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-stone-400 hover:text-white text-sm transition-colors focus:outline-none focus:underline"
                      aria-label={`Follow Marlo on ${item.label}`}
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-600 text-xs tracking-wide">
              &copy; {new Date().getFullYear()} Marlo Luxury Rentals. All rights reserved.
            </p>
            <nav aria-label="Legal links">
              <ul className="flex items-center gap-6" role="list">
                <li>
                  <Link
                    href="/privacy"
                    className="text-stone-600 hover:text-stone-300 text-xs tracking-wide transition-colors focus:outline-none focus:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-stone-600 hover:text-stone-300 text-xs tracking-wide transition-colors focus:outline-none focus:underline"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
