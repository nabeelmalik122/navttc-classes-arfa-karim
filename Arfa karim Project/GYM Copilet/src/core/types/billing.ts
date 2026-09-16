import type { BaseEntity, ID, ISODateString } from './common';

export type BillingInterval = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type SubscriptionStatus = 
  | 'incomplete' 
  | 'trialing' 
  | 'active' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'paused';

export interface MembershipPlan extends BaseEntity {
  tenantId: ID;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: BillingInterval;
  maxWeeklyClasses?: number;
  includedAmenities: string[];
  stripePriceId: string;
  isActive: boolean;
}

export interface MemberSubscription extends BaseEntity {
  tenantId: ID;
  memberId: ID;
  planId: ID;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodStart: ISODateString;
  currentPeriodEnd: ISODateString;
  cancelAtPeriodEnd: boolean;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceRecord extends BaseEntity {
  tenantId: ID;
  memberId: ID;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  dueDate: ISODateString;
  paidAt?: ISODateString;
  items: InvoiceItem[];
}
