import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const preferencesSchema = z.object({
  watchStyle: z.enum(["sports", "dress", "casual", "mixed"]),
  occasionFocus: z.enum(["business", "social_events", "everyday", "special_occasions"]),
  caseSizePreference: z.enum(["size_36_38", "size_39_41", "size_42_plus", "no_preference"]),
  familiarBrands: z.array(z.string()).default([]),
  firstOccasion: z.string().max(500).optional(),
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

  const prefs = await prisma.userPreferences.upsert({
    where: { userId },
    create: { userId, ...parsed.data },
    update: parsed.data,
  });

  return NextResponse.json({ preferences: prefs });
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  return NextResponse.json({ preferences: prefs });
}
