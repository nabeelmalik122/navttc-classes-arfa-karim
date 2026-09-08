import * as crypto from "crypto";

export interface VerificationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Verifies Paddle Billing Webhook HMAC-SHA256 signature.
 *
 * Header format: ts=1690000000;h1=5d41402abc4b2a76b9719d911017c592...
 * Signed payload: "${ts}:${rawRequestBody}"
 */
export function verifyPaddleWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secretKey: string | undefined,
  toleranceSeconds: number = 5
): VerificationResult {
  if (!secretKey || secretKey.trim().length === 0) {
    return {
      isValid: false,
      error: "SERVER_SECRET_MISSING: PADDLE_WEBHOOK_SECRET_KEY is not configured.",
    };
  }

  if (!signatureHeader || signatureHeader.trim().length === 0) {
    return {
      isValid: false,
      error: "HEADER_MISSING: Paddle-Signature header is missing from request.",
    };
  }

  try {
    // Parse the Paddle-Signature header components
    const parts = signatureHeader.split(";");
    let ts: string | null = null;
    const signatures: string[] = [];

    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key === "ts") {
        ts = value;
      } else if (key === "h1") {
        signatures.push(value);
      }
    }

    if (!ts || signatures.length === 0) {
      return {
        isValid: false,
        error: "INVALID_SIGNATURE_FORMAT: Unable to extract ts or h1 from header.",
      };
    }

    // Protect against replay attacks (5 minute default window)
    const timestamp = parseInt(ts, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (isNaN(timestamp) || Math.abs(currentTimestamp - timestamp) > toleranceSeconds) {
      return {
        isValid: false,
        error: `TIMESTAMP_DRIFT: Event timestamp (${ts}) is outside the ${toleranceSeconds}s tolerance window.`,
      };
    }

    // Build the exact payload that Paddle signed: "${ts}:${rawBody}"
    const signedPayload = `${ts}:${rawBody}`;

    const computedHash = crypto
      .createHmac("sha256", secretKey)
      .update(signedPayload, "utf8")
      .digest("hex");

    const computedBuffer = Buffer.from(computedHash, "hex");

    // Check if any provided h1 matches the computed HMAC using constant-time comparison
    const matched = signatures.some((sig) => {
      const sigBuffer = Buffer.from(sig, "hex");
      if (sigBuffer.length !== computedBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(sigBuffer, computedBuffer);
    });

    if (!matched) {
      return {
        isValid: false,
        error: "SIGNATURE_MISMATCH: Computed HMAC does not match provided Paddle-Signature.",
      };
    }

    return { isValid: true };
  } catch (err: any) {
    return {
      isValid: false,
      error: `VERIFICATION_EXCEPTION: ${err?.message || "Unknown error"}`,
    };
  }
}
