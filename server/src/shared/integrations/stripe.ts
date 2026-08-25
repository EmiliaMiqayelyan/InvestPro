import { env } from "../../app/config/env";

export type CheckoutSessionResult = {
  sessionId: string;
  checkoutUrl: string;
};

export async function createServiceFeeCheckoutSession(params: {
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutSessionResult> {
  const secret = env.STRIPE_SECRET_KEY;
  const priceId = env.STRIPE_SERVICE_PRICE_ID;

  if (!secret || !priceId) {
    return {
      sessionId: `mock_${params.userId}_${Date.now()}`,
      checkoutUrl: "/investor/membership?checkout=mock",
    };
  }

  return {
    sessionId: `pending_${params.userId}_${Date.now()}`,
    checkoutUrl: params.successUrl || "/investor/membership?checkout=mock",
  };
}

export function verifyStripeWebhookConfigured(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}
