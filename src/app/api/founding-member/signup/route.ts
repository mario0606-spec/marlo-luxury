import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendFoundingMemberLaunchEmail } from "@/lib/email";
import { FOUNDING_MEMBER_LIMIT, generateReferralCode } from "@/lib/founding-member";

const schema = z.object({
  email: z.string().email("Bitte gültige E-Mail-Adresse eingeben"),
  firstName: z.string().min(1).max(60),
  referredBy: z.string().max(12).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const { email, firstName, referredBy } = result.data;

  try {
    // Check slot limit
    const currentCount = await prisma.foundingMember.count();
    if (currentCount >= FOUNDING_MEMBER_LIMIT) {
      return NextResponse.json(
        { error: "Alle Gründungsplätze sind vergeben.", soldOut: true },
        { status: 409 }
      );
    }

    // Check if already registered
    const existing = await prisma.foundingMember.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        referralCode: existing.referralCode,
        slotsRemaining: FOUNDING_MEMBER_LIMIT - currentCount,
      });
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let attempts = 0;
    while (await prisma.foundingMember.findUnique({ where: { referralCode } })) {
      referralCode = generateReferralCode();
      if (++attempts > 10) throw new Error("Failed to generate unique referral code");
    }

    // Create founding member
    const member = await prisma.foundingMember.create({
      data: {
        email,
        firstName,
        referralCode,
        referredByCode: referredBy ?? null,
      },
    });

    // If referred by a valid code, create referral record and credit referrer
    if (referredBy) {
      const referrer = await prisma.foundingMember.findUnique({
        where: { referralCode: referredBy },
      });
      if (referrer && referrer.id !== member.id) {
        await prisma.$transaction([
          prisma.referral.create({
            data: {
              referrerId: referrer.id,
              referredId: member.id,
              creditApplied: true,
              creditCents: 5000,
            },
          }),
          prisma.foundingMember.update({
            where: { id: referrer.id },
            data: {
              referralCount: { increment: 1 },
              creditCents: { increment: 5000 },
            },
          }),
        ]);
      }
    }

    const slotsRemaining = FOUNDING_MEMBER_LIMIT - currentCount - 1;

    // Send launch email (Email 2) to the new member
    try {
      await sendFoundingMemberLaunchEmail(email, firstName, { slotsRemaining });
    } catch (emailErr) {
      console.error("[founding-member] email send error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      referralCode: member.referralCode,
      slotsRemaining,
    });
  } catch (err) {
    console.error("[founding-member] signup error:", err);
    return NextResponse.json(
      { error: "Etwas ist schiefgelaufen. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
