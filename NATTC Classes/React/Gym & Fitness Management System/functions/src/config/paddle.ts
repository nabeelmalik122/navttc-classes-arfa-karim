import { IronxPlanId } from "../types";

/**
 * Authoritative Server-Side Paddle Sandbox Price ID Mapping.
 * Never trust client-supplied plan IDs or price amounts.
 */
export const PADDLE_PRICE_TO_PLAN_MAP: Readonly<Record<string, IronxPlanId>> = {
  // Foundation Tier ($79/mo)
  "pri_01m1ycsj1fxkmjwzdy6h0f4qq": "plan_foundation",

  // Pro Athlete Tier ($149/mo)
  "pri_01m1yd0jj79agxr785m6pb3jnx": "plan_pro",

  // Titan All-Access Tier ($249/mo)
  "pri_01m1yd44b101sqqsxp79gasdpn": "plan_titan_all_access",
};

/**
 * Resolves an authoritative IRONX Plan ID from a Paddle Price ID.
 * Returns null if the price ID is unrecognized (fail closed).
 */
export function resolveIronxPlanId(paddlePriceId: string): IronxPlanId | null {
  if (!paddlePriceId || typeof paddlePriceId !== "string") {
    return null;
  }
  return PADDLE_PRICE_TO_PLAN_MAP[paddlePriceId] || null;
}

/**
 * Retrieves the server-side Paddle Webhook secret key.
 * Never expose this key in client-side code or VITE_* variables.
 */
export function getPaddleWebhookSecret(): string | undefined {
  return process.env.PADDLE_WEBHOOK_SECRET_KEY;
}
