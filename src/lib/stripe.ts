import Stripe from "stripe";
import { prisma } from "./prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: "Basic",
    description: "One curated mystery item delivered monthly",
    priceId: process.env.STRIPE_PRICE_BASIC!,
    amount: 9900,
  },
  PREMIUM: {
    name: "Premium",
    description: "Choose monthly from our curated selection",
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    amount: 19900,
  },
  VIP: {
    name: "VIP",
    description: "White-glove concierge selection, unlimited access",
    priceId: process.env.STRIPE_PRICE_VIP!,
    amount: 49900,
  },
} as const;

export type PlanKey = keyof typeof SUBSCRIPTION_PLANS;

export async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });

  if (!user) throw new Error("User not found");
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name ?? undefined,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
