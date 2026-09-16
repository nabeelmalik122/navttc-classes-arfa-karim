import { env } from '@/core/config/env';

export interface CheckoutSessionOptions {
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

export class StripeApiClient {
  private readonly publishableKey: string;

  constructor() {
    this.publishableKey = env.stripe.publishableKey;
  }

  getPublishableKey(): string {
    return this.publishableKey;
  }

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ checkoutUrl: string }> {
    // Communicates with Firebase Callable Function / Backend
    return {
      checkoutUrl: `https://checkout.stripe.com/pay/mock_session_${options.planId}`,
    };
  }
}

export const stripeClient = new StripeApiClient();
