import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycStatus: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.kycStatus === "VERIFIED") {
    return NextResponse.json({ kycStatus: "VERIFIED" });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const verificationSession = await stripe.identity.verificationSessions.create({
    type: "document",
    options: {
      document: {
        allowed_types: ["driving_license", "passport", "id_card"],
        require_id_number: false,
        require_live_capture: true,
        require_matching_selfie: true,
      },
    },
    metadata: { userId },
    return_url: `${appUrl}/kyc/return?session_id={VERIFICATION_SESSION_ID}`,
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "PENDING",
      stripeVerificationSessionId: verificationSession.id,
    },
  });

  return NextResponse.json({ url: verificationSession.url });
}
