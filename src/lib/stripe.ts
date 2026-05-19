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

// KYC: require identity verification for rentals with total ≥ €500
export const KYC_THRESHOLD_CENTS = 50000;

// Damage waiver flat fee: €19
export const WAIVER_AMOUNT_CENTS = 1900;

// Tiered deposit amounts based on item retail price (in cents)
export function calcDepositAmount(retailPriceCents: number): number {
  if (retailPriceCents < 150000) return 15000;  // <€1,500 → €150
  if (retailPriceCents <= 500000) return 30000; // €1,500–€5,000 → €300
  return 50000;                                  // >€5,000 → €500
}

// Create a deposit hold (manual capture PaymentIntent)
export async function createDepositHold(
  customerId: string,
  paymentMethodId: string,
  depositAmountCents: number,
  rentalId: string
): Promise<string> {
  const pi = await stripe.paymentIntents.create({
    amount: depositAmountCents,
    currency: "eur",
    customer: customerId,
    payment_method: paymentMethodId,
    capture_method: "manual",
    confirm: true,
    off_session: true,
    description: "Damage deposit hold — refunded on safe return",
    metadata: { rentalId, type: "deposit_hold" },
    error_on_requires_action: true,
  });
  return pi.id;
}

// Release (cancel) a deposit hold — called on return confirmation
export async function releaseDepositHold(depositIntentId: string): Promise<void> {
  await stripe.paymentIntents.cancel(depositIntentId);
}

// Capture a deposit hold (full or partial) — called on admin-confirmed damage
export async function captureDepositHold(
  depositIntentId: string,
  captureAmountCents?: number
): Promise<void> {
  await stripe.paymentIntents.capture(depositIntentId, {
    ...(captureAmountCents ? { amount_to_capture: captureAmountCents } : {}),
  });
}
