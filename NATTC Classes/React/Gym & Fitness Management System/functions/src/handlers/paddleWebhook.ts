import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { getPaddleWebhookSecret, resolveIronxPlanId } from "../config/paddle";
import { verifyPaddleWebhookSignature } from "../services/paddleWebhookVerifier";
import { computeAccessPolicy } from "../services/accessPolicy";
import {
  PaddleSubscriptionData,
  PaddleTransactionData,
  PaddleWebhookEvent,
  UserSubscriptionRecord,
} from "../types";

const getDb = () => admin.firestore();

/**
 * Express Request handler for Paddle Billing Webhook endpoints.
 */
export async function handlePaddleWebhook(req: Request, res: Response): Promise<void> {
  const secretKey = getPaddleWebhookSecret();

  // Fail safely if webhook secret is unconfigured
  if (!secretKey) {
    console.error("[IRONX Webhook] CRITICAL: PADDLE_WEBHOOK_SECRET_KEY is not configured.");
    res.status(500).json({
      error: "SERVER_CONFIGURATION_ERROR",
      message: "Webhook processing is currently unconfigured.",
    });
    return;
  }

  // Obtain raw payload for cryptographic signature verification
  const signatureHeader = req.headers["paddle-signature"] as string | undefined;
  const rawBody = (req as any).rawBody
    ? (req as any).rawBody.toString("utf8")
    : JSON.stringify(req.body);

  const verification = verifyPaddleWebhookSignature(rawBody, signatureHeader, secretKey);

  if (!verification.isValid) {
    console.warn(`[IRONX Webhook] Signature verification failed: ${verification.error}`);
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid Paddle webhook signature.",
    });
    return;
  }

  let event: PaddleWebhookEvent;
  try {
    event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (parseErr) {
    console.error("[IRONX Webhook] Failed to parse webhook JSON payload:", parseErr);
    res.status(400).json({ error: "INVALID_JSON_PAYLOAD" });
    return;
  }

  const { event_id, event_type, occurred_at } = event;

  if (!event_id || !event_type) {
    res.status(400).json({ error: "MISSING_EVENT_METADATA" });
    return;
  }

  const db = getDb();
  const eventRef = db.collection("paddle_events").doc(event_id);

  try {
    // 1. Idempotency Check
    const eventDoc = await eventRef.get();
    if (eventDoc.exists && eventDoc.data()?.status === "PROCESSED") {
      console.log(`[IRONX Webhook] Duplicate event ${event_id} already processed. Acknowledging.`);
      res.status(200).json({ received: true, duplicate: true, eventId: event_id });
      return;
    }

    // 2. Dispatch event based on category
    if (event_type.startsWith("subscription.")) {
      await handleSubscriptionEvent(event, db);
    } else if (event_type.startsWith("transaction.")) {
      await handleTransactionEvent(event, db);
    } else {
      console.log(`[IRONX Webhook] Ignored non-subscription event type: ${event_type}`);
    }

    // 3. Mark Event as successfully processed
    await eventRef.set(
      {
        eventId: event_id,
        eventType: event_type,
        occurredAt: occurred_at,
        processedAt: new Date().toISOString(),
        status: "PROCESSED",
      },
      { merge: true }
    );

    res.status(200).json({ received: true, eventId: event_id });
  } catch (err: any) {
    console.error(`[IRONX Webhook] Error processing event ${event_id} (${event_type}):`, err);

    // Save failure status for auditability
    await eventRef.set(
      {
        eventId: event_id,
        eventType: event_type,
        occurredAt: occurred_at,
        failedAt: new Date().toISOString(),
        status: "FAILED",
        errorMessage: err?.message || "Unknown error",
      },
      { merge: true }
    );

    // Return 500 so Paddle can retry according to dunning schedule
    res.status(500).json({ error: "PROCESSING_FAILED" });
  }
}

/**
 * Handles authoritative subscription lifecycle transitions.
 */
async function handleSubscriptionEvent(
  event: PaddleWebhookEvent<PaddleSubscriptionData>,
  db: FirebaseFirestore.Firestore
): Promise<void> {
  const subscription = event.data;
  if (!subscription || !subscription.id) {
    throw new Error("Invalid subscription data in webhook payload.");
  }

  const customerId = subscription.customer_id;
  const subscriptionId = subscription.id;

  // Extract recurring price ID from items
  const activeItem =
    subscription.items?.find((i) => i.price?.id) || subscription.items?.[0];
  const priceId = activeItem?.price?.id || "";
  const planId = resolveIronxPlanId(priceId);

  if (!planId) {
    console.warn(
      `[IRONX Webhook] Received unmapped/unknown Paddle Price ID: '${priceId}' for subscription ${subscriptionId}. Access will fail closed.`
    );
  }

  // Resolve IRONX Member UID
  let targetUid: string | null = null;

  // 1. Direct metadata custom_data from checkout session
  if (subscription.custom_data?.ironx_uid) {
    targetUid = String(subscription.custom_data.ironx_uid).trim();
  } else if (subscription.custom_data?.uid) {
    targetUid = String(subscription.custom_data.uid).trim();
  }

  // 2. Fallback: Lookup by existing paddleCustomerId in Firestore
  if (!targetUid && customerId) {
    const customerQuery = await db
      .collection("users")
      .where("paddleCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!customerQuery.empty) {
      targetUid = customerQuery.docs[0].id;
    }
  }

  // 3. Fallback: Lookup by existing paddleSubscriptionId in Firestore
  if (!targetUid && subscriptionId) {
    const subQuery = await db
      .collection("users")
      .where("paddleSubscriptionId", "==", subscriptionId)
      .limit(1)
      .get();

    if (!subQuery.empty) {
      targetUid = subQuery.docs[0].id;
    }
  }

  if (!targetUid) {
    console.warn(
      `[IRONX Webhook] Could not resolve IRONX User UID for customer ${customerId}, subscription ${subscriptionId}.`
    );
    return;
  }

  const userRef = db.collection("users").doc(targetUid);

  // Execute in atomic transaction to prevent stale race conditions
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists) {
      console.warn(`[IRONX Webhook] User document ${targetUid} does not exist in Firestore.`);
      return;
    }

    const userData = userDoc.data() || {};
    const existingSub = userData.subscription as UserSubscriptionRecord | undefined;

    // Stale Event Protection: Verify event is fresher than last recorded event
    if (existingSub?.lastEventOccurredAt) {
      const lastEventTime = new Date(existingSub.lastEventOccurredAt).getTime();
      const currentEventTime = new Date(event.occurred_at).getTime();

      if (currentEventTime < lastEventTime) {
        console.warn(
          `[IRONX Webhook] Discarding stale event (${event.occurred_at}) because newer state (${existingSub.lastEventOccurredAt}) is already recorded.`
        );
        return;
      }
    }

    // Compute deterministic access policy
    const accessPolicy = computeAccessPolicy({
      status: subscription.status,
      planId: planId,
      currentBillingPeriodEnd: subscription.current_billing_period?.ends_at,
      scheduledChange: subscription.scheduled_change
        ? {
            action: subscription.scheduled_change.action,
            effectiveAt: subscription.scheduled_change.effective_at || null,
          }
        : null,
      occurredAt: event.occurred_at,
      firstPastDueAt:
        subscription.status === "past_due"
          ? existingSub?.status === "past_due"
            ? existingSub.lastEventOccurredAt
            : event.occurred_at
          : null,
    });

    // Construct server-authoritative telemetry record
    const subscriptionRecord: UserSubscriptionRecord = {
      provider: "PADDLE",
      paddleCustomerId: customerId,
      paddleSubscriptionId: subscriptionId,
      paddlePriceId: priceId,
      planId: planId || ("plan_foundation" as any),
      status: subscription.status,
      currentBillingPeriodStart: subscription.current_billing_period?.starts_at || null,
      currentBillingPeriodEnd: subscription.current_billing_period?.ends_at || null,
      scheduledChange: subscription.scheduled_change
        ? {
            action: subscription.scheduled_change.action,
            effectiveAt: subscription.scheduled_change.effective_at || null,
          }
        : null,
      currency: subscription.currency_code || "USD",
      unitPrice: parseInt(activeItem?.price?.unit_price?.amount || "0", 10),
      lastEventId: event.event_id,
      lastEventOccurredAt: event.occurred_at,
      updatedAt: new Date().toISOString(),
    };

    // Update user document with telemetry and accessPolicy
    transaction.update(userRef, {
      paddleCustomerId: customerId,
      paddleSubscriptionId: subscriptionId,
      subscription: subscriptionRecord,
      accessPolicy: accessPolicy,
      updatedAt: new Date().toISOString(),
    });
  });
}

/**
 * Handles transaction reconciliation events.
 */
async function handleTransactionEvent(
  event: PaddleWebhookEvent<PaddleTransactionData>,
  db: FirebaseFirestore.Firestore
): Promise<void> {
  const transaction = event.data;
  if (!transaction || !transaction.id) return;

  const transactionRef = db.collection("paddle_transactions").doc(transaction.id);

  await transactionRef.set(
    {
      transactionId: transaction.id,
      subscriptionId: transaction.subscription_id || null,
      customerId: transaction.customer_id,
      status: transaction.status,
      currency: transaction.currency_code,
      total: transaction.details?.totals?.total || null,
      lastEventId: event.event_id,
      occurredAt: event.occurred_at,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
