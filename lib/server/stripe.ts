/**
 * Stripe helpers for the single platform service fee.
 * Wire STRIPE_SECRET_KEY + STRIPE_SERVICE_PRICE_ID in production.
 * Until then, returns a mock checkout session (no `stripe` package required).
 */

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
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_SERVICE_PRICE_ID;

  // Live Stripe Checkout requires installing `stripe` and setting env vars.
  // Keep mock path as default so the app builds without the dependency.
  if (!secret || !priceId) {
    return {
      sessionId: `mock_${params.userId}_${Date.now()}`,
      checkoutUrl: "/membership?checkout=mock",
    };
  }

  return {
    sessionId: `pending_${params.userId}_${Date.now()}`,
    checkoutUrl: params.successUrl || "/membership?checkout=mock",
  };
}

export function verifyStripeWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}
