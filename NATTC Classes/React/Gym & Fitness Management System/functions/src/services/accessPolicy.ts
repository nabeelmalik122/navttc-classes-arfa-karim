import {
  IronxAccessPolicy,
  IronxPlanId,
  PaddleSubscriptionStatus,
} from "../types";

export interface ComputePolicyInput {
  status: PaddleSubscriptionStatus | string | null | undefined;
  planId: IronxPlanId | null;
  currentBillingPeriodEnd: string | null | undefined;
  scheduledChange?: {
    action: "cancel" | "pause" | "resume" | string;
    effectiveAt: string | null;
  } | null;
  occurredAt?: string;
  firstPastDueAt?: string | null;
  currentTimestamp?: number; // For testability
}

const GRACE_PERIOD_MS = 72 * 60 * 60 * 1000; // 72 Hours

/**
 * Pure function to compute the server-authoritative IRONX Access Policy
 * from validated Paddle subscription telemetry.
 */
export function computeAccessPolicy(input: ComputePolicyInput): IronxAccessPolicy {
  const now = input.currentTimestamp ?? Date.now();
  const updatedAt = new Date(now).toISOString();

  // If no recognized plan or status is missing, fail closed to NONE
  if (!input.planId || !input.status) {
    return {
      subscriptionRequired: true,
      subscriptionStatus: "none",
      planId: null,
      accessState: "none",
      effectiveUntil: null,
      updatedAt,
    };
  }

  const status = input.status as PaddleSubscriptionStatus;
  const periodEndIso = input.currentBillingPeriodEnd || null;
  const periodEndMs = periodEndIso ? new Date(periodEndIso).getTime() : null;

  switch (status) {
    case "active":
    case "trialing": {
      // If a cancellation is scheduled for the future, maintain active access until period end
      if (input.scheduledChange?.action === "cancel" && periodEndMs) {
        if (now < periodEndMs) {
          return {
            subscriptionRequired: true,
            subscriptionStatus: status,
            planId: input.planId,
            accessState: "active",
            effectiveUntil: periodEndIso,
            updatedAt,
          };
        } else {
          // Period already expired
          return {
            subscriptionRequired: true,
            subscriptionStatus: "canceled",
            planId: input.planId,
            accessState: "canceled",
            effectiveUntil: null,
            updatedAt,
          };
        }
      }

      return {
        subscriptionRequired: true,
        subscriptionStatus: status,
        planId: input.planId,
        accessState: "active",
        effectiveUntil: periodEndIso,
        updatedAt,
      };
    }

    case "past_due": {
      // 72-Hour Application Grace Period Calculation
      const pastDueAnchor = input.firstPastDueAt || input.occurredAt || new Date(now).toISOString();
      const pastDueAnchorMs = new Date(pastDueAnchor).getTime();
      const graceExpiresMs = pastDueAnchorMs + GRACE_PERIOD_MS;
      const graceExpiresIso = new Date(graceExpiresMs).toISOString();

      if (now < graceExpiresMs) {
        return {
          subscriptionRequired: true,
          subscriptionStatus: "past_due",
          planId: input.planId,
          accessState: "grace",
          effectiveUntil: graceExpiresIso,
          updatedAt,
        };
      } else {
        // Grace period expired without payment recovery
        return {
          subscriptionRequired: true,
          subscriptionStatus: "past_due",
          planId: input.planId,
          accessState: "restricted",
          effectiveUntil: null,
          updatedAt,
        };
      }
    }

    case "paused": {
      return {
        subscriptionRequired: true,
        subscriptionStatus: "paused",
        planId: input.planId,
        accessState: "restricted",
        effectiveUntil: null,
        updatedAt,
      };
    }

    case "canceled": {
      return {
        subscriptionRequired: true,
        subscriptionStatus: "canceled",
        planId: input.planId,
        accessState: "canceled",
        effectiveUntil: null,
        updatedAt,
      };
    }

    default: {
      // Fail closed on any unrecognized status
      return {
        subscriptionRequired: true,
        subscriptionStatus: "none",
        planId: null,
        accessState: "none",
        effectiveUntil: null,
        updatedAt,
      };
    }
  }
}
