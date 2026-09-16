import type { BaseEntity, ID, ISODateString } from './common';

export type PlanInterval = 'month' | 'year';

export interface MembershipPlan extends BaseEntity {
  name: string;
  price: number;
  interval: PlanInterval;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface MemberSubscription extends BaseEntity {
  memberId: ID;
  planId: ID;
  planName: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: ISODateString;
  endDate: ISODateString;
  amount: number;
}
