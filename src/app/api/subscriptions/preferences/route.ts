import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const preferencesSchema = z.object({
  watchStyle: z.enum(["dress", "sports", "casual", "mixed"]),
  occasionFocus: z.enum(["business", "social_events", "everyday", "special_occasions"]),
  caseSizePreference: z.enum(["36-38mm", "39-41mm", "42mm+", "no_preference"]),
  brandFamiliarity: z.array(z.string()).default([]),
  occasionNote: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = preferencesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid preferences", details: parsed.error.flatten() }, { status: 400 });
  }

  const { watchStyle, occasionFocus, caseSizePreference, brandFamiliarity, occasionNote } = parsed.data;

  const prefs = await prisma.userPreferences.upsert({
    where: { userId },
    create: { userId, watchStyle, occasionFocus, caseSizePreference, brandFamiliarity, occasionNote },
    update: { watchStyle, occasionFocus, caseSizePreference, brandFamiliarity, occasionNote },
  });

  // When editing existing preferences from the dashboard, skip the selection
  // redirect — caller stays in their settings flow.
  const isEdit = req.nextUrl.searchParams.get("edit") === "true";

  return NextResponse.json({ id: prefs.id, skipSelection: isEdit });
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  return NextResponse.json(prefs ?? null);
}
