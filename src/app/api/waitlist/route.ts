import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, name, source } = result.data;

  try {
    await prisma.waitlistEntry.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: name ?? null,
        source: source ?? "homepage",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[waitlist] signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
