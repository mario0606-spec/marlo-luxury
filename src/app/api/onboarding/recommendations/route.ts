import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Brand-to-style affinity for naive recommendation scoring
const BRAND_STYLE: Record<string, string[]> = {
  Rolex: ["sports", "casual", "dress"],
  "Patek Philippe": ["dress"],
  IWC: ["sports", "casual"],
  Breitling: ["sports"],
  Omega: ["sports", "casual", "dress"],
  TAG: ["sports", "casual"],
  Nomos: ["dress", "casual"],
  "A. Lange & Söhne": ["dress"],
  Jaeger: ["dress"],
  Cartier: ["dress"],
};

const SIZE_RANGES: Record<string, [number, number]> = {
  size_36_38: [36, 38],
  size_39_41: [39, 41],
  size_42_plus: [42, 60],
  no_preference: [0, 99],
};

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });

  // Fetch available watches
  const items = await prisma.item.findMany({
    where: { available: true, category: "WATCH" },
    take: 20,
    orderBy: { featured: "desc" },
  });

  // Score each item against preferences
  const scored = items.map((item) => {
    let score = 0;

    // Brand familiarity bonus
    if (prefs?.familiarBrands?.includes(item.brand)) score += 3;

    // Style affinity
    if (prefs?.watchStyle) {
      const brandStyles = BRAND_STYLE[item.brand] ?? [];
      if (brandStyles.includes(prefs.watchStyle)) score += 2;
    }

    // Case size from metadata
    const caseMm = (item.metadata as Record<string, unknown> | null)?.caseMm as number | undefined;
    if (caseMm && prefs?.caseSizePreference && prefs.caseSizePreference !== "no_preference") {
      const [min, max] = SIZE_RANGES[prefs.caseSizePreference] ?? [0, 99];
      if (caseMm >= min && caseMm <= max) score += 2;
    }

    // Featured bonus
    if (item.featured) score += 1;

    return { item, score };
  });

  // Sort by score descending, return top 3
  scored.sort((a, b) => b.score - a.score);
  const recommendations = scored.slice(0, 3).map(({ item }) => item);

  return NextResponse.json({ recommendations, preferences: prefs });
}
