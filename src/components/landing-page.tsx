"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { WaitlistForm } from "@/components/waitlist-form";
import { LanguageToggle } from "@/components/language-toggle";
import { useLang } from "@/lib/lang-context";

const translations = {
  de: {
    nav: {
      howItWorks: "So funktioniert's",
      collection: "Kollektion",
      signIn: "Anmelden",
      joinWaitlist: "Warteliste",
      myAccount: "Mein Konto",
      ariaLabel: "marianni Startseite",
      ariaNav: "Hauptnavigation",
    },
    hero: {
      eyebrow: "Luxusuhren · Verleih-Marktplatz",
      headline1: "Trage den",
      headline2: "Moment.",
      body: "Leihe ikonische Uhren der weltweit renommiertesten Marken — für Hochzeiten, Galas oder jeden Moment, der das Außergewöhnliche verdient.",
      ctaPrimary: "Frühzugang sichern",
      ctaSecondary: "So funktioniert's",
      ariaLabel: "Hero — Trage den Moment",
    },
    howItWorks: {
      eyebrow: "Das Erlebnis",
      heading: "Luxus in drei Schritten",
      steps: [
        {
          num: "01",
          title: "Stöbern",
          desc: "Entdecke unsere kuratierte Auswahl an Rolex, Patek Philippe, Cartier, Van Cleef & Arpels und mehr — jedes Stück authentifiziert und versichert.",
        },
        {
          num: "02",
          title: "Buchen",
          desc: "Wähle deine Daten und den Mietzeitraum. Sicher online bezahlen. Wir liefern in diskreter Luxusverpackung direkt zu dir nach Hause.",
        },
        {
          num: "03",
          title: "Tragen",
          desc: "Genieße das Stück für deinen Anlass. Danach organisieren wir eine reibungslose, versicherte Abholung — ohne Verpflichtung, ohne Aufwand.",
        },
      ],
    },
    collection: {
      eyebrow: "Die Kollektion",
      heading: "Ikonische Uhren für jeden Anlass",
      watchesAria: "Luxusuhren Kollektion",
      watchesEyebrow: "Zeitmesser",
      watchesTitle: "Uhren",
      subEyebrow: "Abonnements",
      subTitle: "Eine neue Uhr, jeden Monat",
      subBody: "Basic · Premium · VIP — kuratierte Auswahl, regelmäßig zu dir geliefert.",
      subCta: "Warteliste beitreten",
    },
    promise: {
      items: [
        {
          title: "Authentifiziert",
          desc: "Jedes Stück von zertifizierten Experten geprüft. Du trägst immer das Original — mit vollständiger Dokumentation.",
        },
        {
          title: "Vollversichert",
          desc: "Alle Mietartikel sind umfassend versichert. Trage sie mit voller Zuversicht und Sicherheit.",
        },
        {
          title: "Weißhandschuh-Lieferung",
          desc: "Diskrete Luxusverpackung, sichere Lieferung und Abholung — alles nach deinem Zeitplan, direkt bei dir.",
        },
      ],
    },
    press: {
      eyebrow: "Bald vorgestellt in",
    },
    testimonials: {
      eyebrow: "Erste Mitglieder",
      heading: "Geliebt noch vor dem Launch",
      items: [
        {
          quote:
            "Endlich eine Möglichkeit, die Rolex zu tragen, von der ich immer geträumt habe — an meinem Hochzeitstag, ohne einen lebensverändernden Kauf.",
          name: "S.K.",
          detail: "Erstes Mitglied",
        },
        {
          quote:
            "marianni hat es möglich gemacht, meine Frau zu unserem Jahrestag mit ihrem Traumarmband von Cartier zu überraschen. Mühelos.",
          name: "M.L.",
          detail: "Erstes Mitglied",
        },
        {
          quote:
            "Das Abo-Modell ist brillant. Jeden Monat ein anderes ikonisches Zeitmesser. Ich bin vollkommen begeistert.",
          name: "A.P.",
          detail: "Erstes Mitglied",
        },
      ],
    },
    waitlist: {
      eyebrow: "Frühzugang",
      heading1: "Trage",
      heading2: "deinen Moment.",
      body: "Wir starten bald. Melde dich auf der Warteliste an für Frühzugang, Gründungsmitglied-Preise und einen ersten Blick auf die Kollektion.",
      footnote: "Kein Spam. Jederzeit abmelden. Wir respektieren deine Privatsphäre.",
    },
    footer: {
      tagline: "Luxusuhren zugänglich für jeden Anlass — Tagesmiete bis Monatsabonnement.",
      companyHeading: "Unternehmen",
      links: [
        { label: "So funktioniert's", href: "#how-it-works" },
        { label: "Die Kollektion", href: "#collection" },
        { label: "Warteliste beitreten", href: "#waitlist" },
        { label: "Anmelden", href: "/auth/signin" },
      ],
      followHeading: "Folge uns",
      social: [
        { label: "Instagram", href: "#" },
        { label: "TikTok", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "WhatsApp", href: "#" },
      ],
      copyright: `© ${new Date().getFullYear()} marianni GmbH. Alle Rechte vorbehalten.`,
      privacy: "Datenschutz",
      terms: "AGB",
    },
  },
  en: {
    nav: {
      howItWorks: "How It Works",
      collection: "Collection",
      signIn: "Sign In",
      joinWaitlist: "Waitlist",
      myAccount: "My Account",
      ariaLabel: "marianni home",
      ariaNav: "Main navigation",
    },
    hero: {
      eyebrow: "Luxury Watches · Rental Marketplace",
      headline1: "Wear the",
      headline2: "Moment.",
      body: "Rent iconic watches from the world's most prestigious brands — for a wedding, gala, or any moment that deserves the extraordinary.",
      ctaPrimary: "Get Early Access",
      ctaSecondary: "How It Works",
      ariaLabel: "Hero — Wear the Moment",
    },
    howItWorks: {
      eyebrow: "The Experience",
      heading: "Luxury in Three Steps",
      steps: [
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
      ],
    },
    collection: {
      eyebrow: "The Collection",
      heading: "Iconic Watches, Every Occasion",
      watchesAria: "Luxury watches collection",
      watchesEyebrow: "Timepieces",
      watchesTitle: "Watches",
      subEyebrow: "Subscriptions",
      subTitle: "A new watch, every month",
      subBody: "Basic · Premium · VIP — curated selections delivered to your door on a recurring basis.",
      subCta: "Join Waitlist",
    },
    promise: {
      items: [
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
      ],
    },
    press: {
      eyebrow: "As Featured In · Coming Soon",
    },
    testimonials: {
      eyebrow: "Early Members",
      heading: "Loved Before Launch",
      items: [
        {
          quote:
            "Finally, a way to wear the Rolex I've always dreamed of — for my wedding day, without a life-changing purchase.",
          name: "S.K.",
          detail: "Early member",
        },
        {
          quote:
            "marianni made it possible to surprise my wife with her dream Cartier bracelet for our anniversary. Effortless.",
          name: "M.L.",
          detail: "Early member",
        },
        {
          quote:
            "The subscription model is brilliant. A different iconic timepiece every month. I'm completely hooked.",
          name: "A.P.",
          detail: "Early member",
        },
      ],
    },
    waitlist: {
      eyebrow: "Early Access",
      heading1: "Wear",
      heading2: "your moment.",
      body: "We are launching soon. Join the waitlist for early access, founding member pricing, and a curated first look at the collection.",
      footnote: "No spam. Unsubscribe anytime. We respect your privacy.",
    },
    footer: {
      tagline: "Luxury watches and fine jewelry, accessible for every occasion — daily rental to monthly subscription.",
      companyHeading: "Company",
      links: [
        { label: "How It Works", href: "#how-it-works" },
        { label: "The Collection", href: "#collection" },
        { label: "Join Waitlist", href: "#waitlist" },
        { label: "Sign In", href: "/auth/signin" },
      ],
      followHeading: "Follow Us",
      social: [
        { label: "Instagram", href: "#" },
        { label: "TikTok", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "WhatsApp", href: "#" },
      ],
      copyright: `© ${new Date().getFullYear()} marianni GmbH. All rights reserved.`,
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },
};

interface LandingPageProps {
  session: Session | null;
}

export function LandingPage({ session }: LandingPageProps) {
  const { lang } = useLang();
  const c = translations[lang];

  return (
    <main className="bg-ivory overflow-x-hidden">
      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-charcoal/95 backdrop-blur-sm"
        role="navigation"
        aria-label={c.nav.ariaNav}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-white text-xl tracking-[0.35em] font-light lowercase focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-stone-900"
              aria-label={c.nav.ariaLabel}
            >
              marianni
            </Link>

            <div className="flex items-center gap-6 text-sm tracking-widest uppercase">
              <Link
                href="#how-it-works"
                className="text-stone-300 hover:text-white transition-colors hidden md:block focus:outline-none focus:underline"
              >
                {c.nav.howItWorks}
              </Link>
              <Link
                href="#collection"
                className="text-stone-300 hover:text-white transition-colors hidden md:block focus:outline-none focus:underline"
              >
                {c.nav.collection}
              </Link>

              {session ? (
                <Link
                  href="/dashboard"
                  className="text-stone-300 hover:text-white transition-colors text-sm tracking-widest uppercase focus:outline-none focus:underline"
                >
                  {c.nav.myAccount}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-stone-300 hover:text-white transition-colors hidden sm:block focus:outline-none focus:underline"
                  >
                    {c.nav.signIn}
                  </Link>
                  <Link
                    href="#waitlist"
                    className="bg-gold-500 hover:bg-gold-400 text-stone-900 px-5 py-2 text-xs font-medium tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-gold-300"
                  >
                    {c.nav.joinWaitlist}
                  </Link>
                </>
              )}
              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center bg-charcoal overflow-hidden"
        aria-label={c.hero.ariaLabel}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800/70 to-stone-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-gold-400/4 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] bg-gold-300/4 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/3 pointer-events-none" />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.45em] uppercase mb-10 font-light">
            {c.hero.eyebrow}
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-light italic text-white tracking-tight leading-[1.04] mb-8">
            {c.hero.headline1}
            <br />
            <span className="text-gold-500">{c.hero.headline2}</span>
          </h1>

          <p className="text-stone-300/80 text-lg sm:text-xl max-w-2xl mx-auto mb-14 leading-relaxed font-light">
            {c.hero.body}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#waitlist"
              className="bg-gold-500 hover:bg-gold-400 text-stone-900 px-10 py-4 text-sm font-medium tracking-widest uppercase transition-colors w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-gold-300"
            >
              {c.hero.ctaPrimary}
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white/25 hover:border-white/60 text-white/80 hover:text-white px-10 py-4 text-sm tracking-widest uppercase transition-colors w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {c.hero.ctaSecondary}
            </Link>
          </div>

          <div className="mt-20 flex items-center justify-center gap-10 text-stone-500">
            {[
              ["Rolex", "Uhren"],
              ["Patek Philippe", "Uhren"],
              ["Cartier", "Schmuck"],
              ["Van Cleef", "Schmuck"],
            ].map(([brand, cat]) => (
              <div key={brand} className="text-center hidden sm:block">
                <p className="text-xs text-stone-300/60 tracking-wider">{brand}</p>
                <p className="text-[0.6rem] text-stone-600 tracking-widest uppercase mt-0.5">{cat}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" aria-hidden="true">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-stone-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-stone-500/50" />
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-28 lg:py-36 bg-ivory"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-500 text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
              {c.howItWorks.eyebrow}
            </p>
            <h2
              id="how-it-works-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-light italic text-charcoal tracking-tight"
            >
              {c.howItWorks.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {c.howItWorks.steps.map((step) => (
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

      {/* ── Collection Showcase ──────────────────────────────────────────── */}
      <section
        id="collection"
        className="py-28 lg:py-36 bg-cream/30"
        aria-labelledby="collection-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-500 text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
              {c.collection.eyebrow}
            </p>
            <h2
              id="collection-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-light italic text-charcoal tracking-tight"
            >
              {c.collection.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Watches card */}
            <div
              className="relative overflow-hidden bg-charcoal aspect-[16/7] group"
              role="img"
              aria-label={c.collection.watchesAria}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-gold-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-gold-500/20" aria-hidden="true" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-gold-500/12" aria-hidden="true" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-gold-500/8" aria-hidden="true" />
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
                  {c.collection.watchesEyebrow}
                </p>
                <h3 className="text-white text-2xl sm:text-3xl font-light tracking-wide mb-4">
                  {c.collection.watchesTitle}
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

          </div>

          {/* Subscription teaser */}
          <div className="mt-5 bg-ivory border border-cream p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-gold-500 text-[0.65rem] tracking-[0.4em] uppercase mb-2 font-light">
                  {c.collection.subEyebrow}
                </p>
                <h3 className="text-stone-900 text-xl sm:text-2xl font-light tracking-wide">
                  {c.collection.subTitle}
                </h3>
                <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                  {c.collection.subBody}
                </p>
              </div>
              <Link href="#waitlist" className="btn-outline shrink-0">
                {c.collection.subCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Promise ────────────────────────────────────────────────── */}
      <section className="py-28 lg:py-36 bg-white" aria-label="Versprechen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 text-center">
            {c.promise.items.map((item) => (
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

      {/* ── Press / Social Proof ─────────────────────────────────────────── */}
      <section
        className="py-16 bg-stone-50 border-y border-stone-200"
        aria-label="Presse"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-stone-400 text-[0.6rem] tracking-[0.45em] uppercase mb-10">
            {c.press.eyebrow}
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-8 lg:gap-16"
            role="list"
            aria-label="Presse"
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

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section
        className="py-28 lg:py-36 bg-ivory"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-500 text-[0.65rem] tracking-[0.45em] uppercase mb-4 font-light">
              {c.testimonials.eyebrow}
            </p>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight"
            >
              {c.testimonials.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.testimonials.items.map((t, i) => (
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

      {/* ── Waitlist CTA ─────────────────────────────────────────────────── */}
      <section
        id="waitlist"
        className="relative py-32 lg:py-44 bg-charcoal overflow-hidden"
        aria-labelledby="waitlist-heading"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800/60 to-stone-950 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto text-center px-4 sm:px-6">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.45em] uppercase mb-6 font-light">
            {c.waitlist.eyebrow}
          </p>
          <h2
            id="waitlist-heading"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-light italic text-ivory tracking-tight mb-6 leading-tight"
          >
            {c.waitlist.heading1}
            <br />
            <span className="lowercase">{c.waitlist.heading2}</span>
          </h2>
          <p className="text-stone-300/70 text-lg mb-12 leading-relaxed font-light">
            {c.waitlist.body}
          </p>

          <WaitlistForm source="homepage" />

          <p className="text-stone-600 text-xs mt-5 tracking-wide">
            {c.waitlist.footnote}
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-charcoal py-16 lg:py-20" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            <div>
              <Link
                href="/"
                className="text-white text-xl tracking-[0.35em] font-light lowercase block mb-5 focus:outline-none focus:underline"
                aria-label={c.nav.ariaLabel}
              >
                marianni
              </Link>
              <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                {c.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="text-stone-500 text-[0.6rem] tracking-[0.4em] uppercase mb-6">
                {c.footer.companyHeading}
              </h4>
              <ul className="space-y-3" role="list">
                {c.footer.links.map((item) => (
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

            <div>
              <h4 className="text-stone-500 text-[0.6rem] tracking-[0.4em] uppercase mb-6">
                {c.footer.followHeading}
              </h4>
              <ul className="space-y-3" role="list">
                {c.footer.social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-stone-400 hover:text-white text-sm transition-colors focus:outline-none focus:underline"
                      aria-label={`${lang === "de" ? "Folge marianni auf" : "Follow marianni on"} ${item.label}`}
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
              {c.footer.copyright}
            </p>
            <nav aria-label={lang === "de" ? "Rechtliche Links" : "Legal links"}>
              <ul className="flex items-center gap-6" role="list">
                <li>
                  <Link
                    href="/privacy"
                    className="text-stone-600 hover:text-stone-300 text-xs tracking-wide transition-colors focus:outline-none focus:underline"
                  >
                    {c.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-stone-600 hover:text-stone-300 text-xs tracking-wide transition-colors focus:outline-none focus:underline"
                  >
                    {c.footer.terms}
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
