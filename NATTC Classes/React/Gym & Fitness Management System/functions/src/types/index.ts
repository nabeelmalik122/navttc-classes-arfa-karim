export type PaddleSubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "paused"
  | "canceled";

export type IronxPlanId =
  | "plan_foundation"
  | "plan_pro"
  | "plan_titan_all_access";

export type IronxAccessState =
  | "active"
  | "grace"
  | "restricted"
  | "canceled"
  | "none";

export interface IronxAccessPolicy {
  subscriptionRequired: boolean;
  subscriptionStatus: PaddleSubscriptionStatus | "none";
  planId: IronxPlanId | null;
  accessState: IronxAccessState;
  effectiveUntil: string | null; // ISO 8601
  updatedAt: string;
}

export interface UserSubscriptionRecord {
  provider: "PADDLE";
  paddleCustomerId: string;
  paddleSubscriptionId: string;
  paddlePriceId: string;
  planId: IronxPlanId;
  status: PaddleSubscriptionStatus;
  currentBillingPeriodStart: string | null;
  currentBillingPeriodEnd: string | null;
  scheduledChange: {
    action: string;
    effectiveAt: string | null;
  } | null;
  currency: string;
  unitPrice: number;
  lastEventId: string;
  lastEventOccurredAt: string;
  updatedAt: string;
}

export interface PaddleWebhookEvent<T = any> {
  event_id: string;
  event_type: string;
  occurred_at: string;
  notification_id?: string;
  data: T;
}

export interface PaddleSubscriptionData {
  id: string;
  status: PaddleSubscriptionStatus;
  customer_id: string;
  address_id?: string;
  business_id?: string;
  currency_code: string;
  created_at: string;
  updated_at: string;
  started_at?: string;
  first_billed_at?: string;
  next_billed_at?: string;
  paused_at?: string;
  canceled_at?: string;
  discount?: any;
  collection_mode?: string;
  billing_details?: any;
  current_billing_period?: {
    starts_at: string;
    ends_at: string;
  };
  billing_cycle?: {
    frequency: number;
    interval: string;
  };
  scheduled_change?: {
    action: "cancel" | "pause" | "resume";
    effective_at: string;
    resume_at?: string;
  } | null;
  items: Array<{
    status: string;
    quantity: number;
    recurring: boolean;
    price: {
      id: string;
      product_id: string;
      description: string;
      name?: string;
      unit_price: {
        amount: string;
        currency_code: string;
      };
    };
  }>;
  custom_data?: {
    ironx_uid?: string;
    uid?: string;
    [key: string]: any;
  } | null;
}

export interface PaddleTransactionData {
  id: string;
  status: "draft" | "ready" | "billed" | "paid" | "completed" | "canceled" | "past_due";
  customer_id: string;
  subscription_id?: string;
  invoice_id?: string;
  currency_code: string;
  created_at: string;
  updated_at: string;
  billed_at?: string;
  details?: {
    totals?: {
      total: string;
      grand_total: string;
    };
    line_items?: Array<{
      price_id: string;
      quantity: number;
    }>;
  };
  custom_data?: {
    ironx_uid?: string;
    uid?: string;
    [key: string]: any;
  } | null;
}
