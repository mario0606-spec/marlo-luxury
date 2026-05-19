import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { stripe, SUBSCRIPTION_PLANS, getOrCreateStripeCustomer } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";

const checkoutSchema = z.object({
  plan: z.enum(["BASIC", "PREMIUM", "VIP"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { plan } = parsed.data;
  const planConfig = SUBSCRIPTION_PLANS[plan as PlanKey];

  if (!planConfig.priceId) {
    return NextResponse.json({ error: "Subscription plan not configured" }, { status: 503 });
  }

  const customerId = await getOrCreateStripeCustomer(userId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    metadata: { userId, plan },
    success_url: `${appUrl}/checkout/success?subscription=true&plan=${plan}`,
    cancel_url: `${appUrl}/dashboard/subscription`,
    subscription_data: {
      metadata: { userId, plan },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
