import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SelectionClient } from "./selection-client";

export const metadata = {
  title: "Your curated selection — Marlo",
};

const STYLE_BRANDS: Record<string, string[]> = {
  dress: ["Patek Philippe", "Vacheron Constantin", "Jaeger-LeCoultre", "Nomos", "Cartier", "IWC"],
  sports: ["Rolex", "Breitling", "TAG Heuer", "Omega", "IWC"],
  casual: ["Omega", "TAG Heuer", "Nomos", "IWC", "Cartier"],
  mixed: ["Rolex", "Omega", "IWC", "Breitling", "Nomos", "Patek Philippe"],
};

const STYLE_LABELS: Record<string, string> = {
  dress: "dress",
  sports: "sports",
  casual: "casual",
  mixed: "mixed-style",
};

const OCCASION_LABELS: Record<string, string> = {
  business: "business",
  social_events: "social",
  everyday: "everyday",
  special_occasions: "special",
};

function buildMatchReason(
  item: { brand: string },
  prefs: { watchStyle: string; brandFamiliarity: string[]; occasionFocus: string },
): string {
  const style = STYLE_LABELS[prefs.watchStyle] ?? "personal";
  const occasion = OCCASION_LABELS[prefs.occasionFocus] ?? "your";
  if (prefs.brandFamiliarity.includes(item.brand)) {
    return `Chosen because: you prefer ${style} watches for ${occasion} occasions.`;
  }
  const styleBrands = STYLE_BRANDS[prefs.watchStyle] ?? [];
  if (styleBrands.includes(item.brand)) {
    return `Chosen because: you prefer ${style} watches for ${occasion} occasions.`;
  }
  return `Chosen because: you prefer ${style} watches for ${occasion} occasions.`;
}

export default async function OnboardingSelectionPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin?callbackUrl=/onboarding/selection");

  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  if (!prefs) redirect("/onboarding/quiz");

  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] } },
    orderBy: { createdAt: "desc" },
  });
  if (!subscription) redirect("/dashboard/subscription");

  const items = await prisma.item.findMany({
    where: { available: true, category: "WATCH" },
    select: {
      id: true,
      name: true,
      brand: true,
      slug: true,
      description: true,
      images: true,
      metadata: true,
    },
  });

  function score(item: { brand: string; metadata: unknown }): number {
    let s = 0;
    if (prefs!.brandFamiliarity.includes(item.brand)) s += 3;
    const styleBrands = STYLE_BRANDS[prefs!.watchStyle] ?? [];
    const idx = styleBrands.indexOf(item.brand);
    if (idx !== -1) s += Math.max(0, 5 - idx);
    const meta = item.metadata as Record<string, unknown> | null;
    const tags: string[] = Array.isArray(meta?.tags) ? (meta!.tags as string[]) : [];
    if (prefs!.occasionFocus === "business" && tags.some((t) => ["dress", "business", "formal"].includes(t))) s += 2;
    if (prefs!.occasionFocus === "social_events" && tags.some((t) => ["dress", "formal", "gala"].includes(t))) s += 2;
    if (prefs!.occasionFocus === "everyday" && tags.some((t) => ["casual", "everyday", "versatile"].includes(t))) s += 2;
    if (prefs!.occasionFocus === "special_occasions" && tags.some((t) => ["special", "dress", "formal"].includes(t))) s += 2;
    return s;
  }

  const scored = items
    .map((it) => ({ it, s: score(it) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map(({ it }) => ({
      id: it.id,
      name: it.name,
      brand: it.brand,
      slug: it.slug,
      images: it.images,
      brandNote: it.description ?? "",
      matchReason: buildMatchReason(it, prefs),
    }));

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">
            Marlo
          </Link>
          <Link
            href="/onboarding/quiz?edit=true"
            className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900"
          >
            Edit preferences
          </Link>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-3">
            Three pieces. Chosen for you.
          </h1>
        </header>

        {prefs.occasionNote && (
          <div className="border-l-2 border-stone-900 pl-4 py-3 mb-8">
            <p className="text-xs tracking-widest uppercase text-stone-500 mb-1">
              CURATED FOR YOU
            </p>
            <p className="text-sm font-light text-stone-700 italic leading-relaxed">
              {prefs.occasionNote}
            </p>
          </div>
        )}

        <SelectionClient watches={scored} />
      </main>
    </div>
  );
}
