import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { handlePaddleWebhook } from "./handlers/paddleWebhook";

// Initialize Firebase Admin SDK once
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Production-grade Paddle Webhook Receiver.
 *
 * Configured as an HTTPS Cloud Function (v2).
 * Verifies HMAC-SHA256 signature using secret injected from Cloud Secret Manager or environment.
 */
export const paddleWebhook = onRequest(
  {
    cors: false,
    maxInstances: 10,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "METHOD_NOT_ALLOWED", message: "Only POST requests are accepted." });
      return;
    }

    await handlePaddleWebhook(req, res);
  }
);
