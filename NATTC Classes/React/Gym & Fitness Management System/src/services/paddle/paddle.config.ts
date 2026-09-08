import type { IronxPricingTier } from "./paddle.types";

/**
 * Approved IRONX Paddle Sandbox Catalog
 * Strictly monthly recurring, zero trials, USD base pricing.
 */
export const PADDLE_SANDBOX_CATALOG: Record<string, IronxPricingTier> = {
  foundation: {
    id: "foundation",
    name: "Foundation",
    tierNumber: "TIER 01 / FOUNDATION",
    tagline: "Essential access for disciplined solo athletes.",
    description: "Full 24/7 Gym Floor & Heavy Iron Access with digital tracking.",
    productId: "pro_01m1ycj1hfq06h8ct0rgt25e6",
    priceId: "pri_01m1ycsj1fxkmjwzdy6h0f4qq",
    baseAmountUsd: 79,
    features: [
      "Full 24/7 Gym Floor & Heavy Iron Access",
      "Digital Locker & Secure Keyless Entry",
      "IRONX Mobile App & Set Logger",
      "2 Group Fitness Class Credits / Month",
      "Standard Recovery Suite Access"
    ],
    isFeatured: false,
    isTitan: false,
  },
  pro: {
    id: "pro",
    name: "Pro Athlete",
    tierNumber: "TIER 02 / PRO ATHLETE",
    tagline: "The premier tier for dedicated functional fitness & strength.",
    description: "Unlimited master classes, full recovery suite, and quarterly body scans.",
    productId: "pro_01m1ycxhga0xpn7g7x6bs50dss",
    priceId: "pri_01m1yd0jj79agxr785m6pb3jnx",
    baseAmountUsd: 149,
    features: [
      "Unlimited Master Group Classes & HIIT Studios",
      "Full Cryotherapy & Infrared Sauna Access",
      "Quarterly InBody 770 Composition Scan",
      "1 Complimentary 1-on-1 PT Session per Month",
      "Custom Macro & Nutrition Plan Builder",
      "Priority Lane Booking (48h in advance)"
    ],
    isFeatured: true,
    isTitan: false,
  },
  titan: {
    id: "titan",
    name: "Titan All-Access",
    tierNumber: "TIER 03 / ALL-ACCESS",
    tagline: "Unrestricted luxury access to all international IRONX centers.",
    description: "Global multi-location access, weekly 1-on-1 coaching, and hyperbaric suites.",
    productId: "pro_01m1yd2k0rfrcmsnenxdvq208x",
    priceId: "pri_01m1yd44b101sqqsxp79gasdpn",
    baseAmountUsd: 249,
    features: [
      "Global Multi-Location Access & Private Valet",
      "Unlimited Classes, Boxing Ring & Turf Arena",
      "Weekly 1-on-1 Dedicated Master Coaching",
      "Hyperbaric Oxygen & Cold Plunge Lounges",
      "Complimentary IRONX Athletic Apparel Pack",
      "Dedicated Private Locker with Laundry Service",
      "Unlimited Guest Passes (Accompanied)"
    ],
    isFeatured: false,
    isTitan: true,
  },
};

export const IRONX_TIERS: IronxPricingTier[] = [
  PADDLE_SANDBOX_CATALOG.foundation,
  PADDLE_SANDBOX_CATALOG.pro,
  PADDLE_SANDBOX_CATALOG.titan,
];

export const getPaddleEnvironment = (): "sandbox" => {
  return "sandbox";
};

export const getPaddleClientToken = (): string => {
  return import.meta.env.VITE_PADDLE_CLIENT_TOKEN || "";
};

export const isPaddleConfigured = (): boolean => {
  const token = getPaddleClientToken();
  return Boolean(token && token.trim().length > 0);
};
