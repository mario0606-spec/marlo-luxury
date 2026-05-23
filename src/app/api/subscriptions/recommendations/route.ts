import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Brand affinities by watch style
const STYLE_BRANDS: Record<string, string[]> = {
  dress: ["Patek Philippe", "Vacheron Constantin", "Jaeger-LeCoultre", "Nomos", "Cartier", "IWC"],
  sports: ["Rolex", "Breitling", "TAG Heuer", "Omega", "IWC"],
  casual: ["Omega", "TAG Heuer", "Nomos", "IWC", "Cartier"],
  mixed: ["Rolex", "Omega", "IWC", "Breitling", "Nomos", "Patek Philippe"],
};

function scoreItem(
  item: { brand: string; name: string; metadata: unknown },
  prefs: { watchStyle: string; brandFamiliarity: string[]; occasionFocus: string }
): number {
  let score = 0;

  // Brand familiarity bonus — gently introduce known brands first
  if (prefs.brandFamiliarity.includes(item.brand)) score += 3;

  // Style match
  const styleBrands = STYLE_BRANDS[prefs.watchStyle] ?? [];
  const brandIndex = styleBrands.indexOf(item.brand);
  if (brandIndex !== -1) score += Math.max(0, 5 - brandIndex);

  // Occasion bonus via metadata tags
  const meta = item.metadata as Record<string, unknown> | null;
  const tags: string[] = Array.isArray(meta?.tags) ? (meta!.tags as string[]) : [];
  if (prefs.occasionFocus === "business" && tags.some((t) => ["dress", "business", "formal"].includes(t))) score += 2;
  if (prefs.occasionFocus === "social_events" && tags.some((t) => ["dress", "formal", "gala"].includes(t))) score += 2;
  if (prefs.occasionFocus === "everyday" && tags.some((t) => ["casual", "everyday", "versatile"].includes(t))) score += 2;
  if (prefs.occasionFocus === "special_occasions" && tags.some((t) => ["special", "dress", "formal"].includes(t))) score += 2;

  return score;
}

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
  special_occasions: "special-occasion",
};

function matchReasonFor(
  item: { brand: string },
  prefs: { watchStyle: string; brandFamiliarity: string[]; occasionFocus: string },
): string {
  if (prefs.brandFamiliarity.includes(item.brand)) {
    return `A familiar name — chosen because you know ${item.brand}.`;
  }
  const styleBrands = STYLE_BRANDS[prefs.watchStyle] ?? [];
  if (styleBrands.includes(item.brand)) {
    return `Chosen for your ${STYLE_LABELS[prefs.watchStyle] ?? "personal"} taste.`;
  }
  return `Recommended for ${OCCASION_LABELS[prefs.occasionFocus] ?? "your"} wear.`;
}

const OCCASION_NOTES: Record<string, string> = {
  business:
    "A precise companion for boardrooms and business travel — understated authority on the wrist.",
  social_events:
    "Conversation at every turn — a watch that commands attention at the finest gatherings.",
  everyday:
    "Effortless versatility. Moves from morning coffee to evening plans without compromise.",
  special_occasions:
    "Wear a piece that marks the moment. A timepiece as memorable as the occasion itself.",
};

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  if (!prefs) return NextResponse.json({ error: "No preferences found" }, { status: 404 });

  // Fetch available watches (WATCH category only for now)
  const items = await prisma.item.findMany({
    where: { available: true, category: "WATCH" },
    select: {
      id: true,
      name: true,
      brand: true,
      slug: true,
      description: true,
      images: true,
      dailyRate: true,
      monthlyRate: true,
      metadata: true,
    },
  });

  if (items.length === 0) {
    // Fallback: return all available items regardless of category
    const fallback = await prisma.item.findMany({
      where: { available: true },
      select: {
        id: true,
        name: true,
        brand: true,
        slug: true,
        description: true,
        images: true,
        dailyRate: true,
        monthlyRate: true,
        metadata: true,
      },
      take: 3,
    });
    return NextResponse.json({
      recommendations: fallback.map((item) => ({
        ...item,
        matchReason: matchReasonFor(item, prefs),
      })),
      occasionNote: OCCASION_NOTES[prefs.occasionFocus] ?? "",
    });
  }

  // Score and sort
  const scored = items
    .map((item) => ({ item, score: scoreItem(item, prefs) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => ({ ...item, matchReason: matchReasonFor(item, prefs) }));

  return NextResponse.json({
    recommendations: scored,
    occasionNote: OCCASION_NOTES[prefs.occasionFocus] ?? "",
  });
}
