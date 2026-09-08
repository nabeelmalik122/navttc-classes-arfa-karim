"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PADDLE_PRICE_TO_PLAN_MAP = void 0;
exports.resolveIronxPlanId = resolveIronxPlanId;
exports.getPaddleWebhookSecret = getPaddleWebhookSecret;
/**
 * Authoritative Server-Side Paddle Sandbox Price ID Mapping.
 * Never trust client-supplied plan IDs or price amounts.
 */
exports.PADDLE_PRICE_TO_PLAN_MAP = {
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
function resolveIronxPlanId(paddlePriceId) {
    if (!paddlePriceId || typeof paddlePriceId !== "string") {
        return null;
    }
    return exports.PADDLE_PRICE_TO_PLAN_MAP[paddlePriceId] || null;
}
/**
 * Retrieves the server-side Paddle Webhook secret key.
 * Never expose this key in client-side code or VITE_* variables.
 */
function getPaddleWebhookSecret() {
    return process.env.PADDLE_WEBHOOK_SECRET_KEY;
}
//# sourceMappingURL=paddle.js.map