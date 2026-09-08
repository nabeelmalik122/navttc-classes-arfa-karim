export type IronxPlanId = "foundation" | "pro" | "titan";

export interface IronxPricingTier {
  id: IronxPlanId;
  name: string;
  tierNumber: string;
  tagline: string;
  description: string;
  productId: string;
  priceId: string;
  baseAmountUsd: number;
  features: string[];
  isFeatured?: boolean;
  isTitan?: boolean;
}

export interface PreviewedPrice {
  priceId: string;
  formattedTotal: string;
  currencyCode: string;
  rawTotal?: string;
}
