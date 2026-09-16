import type { BaseEntity, ID } from './common';

export type SubscriptionTier = 'starter' | 'growth' | 'enterprise';

export interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily?: string;
}

export interface TenantLocation extends BaseEntity {
  tenantId: ID;
  name: string;
  code: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  maxCapacity: number;
  managerId?: ID;
  operatingHours: Record<string, { open: string; close: string; isClosed: boolean }>;
}

export interface TenantEnterprise extends BaseEntity {
  companyName: string;
  slug: string;
  customDomain?: string;
  currency: string;
  timezone: string;
  branding: TenantBranding;
  tier: SubscriptionTier;
  isActive: boolean;
  features: {
    posEnabled: boolean;
    turnstileAccess: boolean;
    nutritionTracking: boolean;
    customMobileApp: boolean;
  };
}
