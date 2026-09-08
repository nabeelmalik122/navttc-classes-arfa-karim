"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaddleWebhookSignature = verifyPaddleWebhookSignature;
const crypto = __importStar(require("crypto"));
/**
 * Verifies Paddle Billing Webhook HMAC-SHA256 signature.
 *
 * Header format: ts=1690000000;h1=5d41402abc4b2a76b9719d911017c592...
 * Signed payload: "${ts}:${rawRequestBody}"
 */
function verifyPaddleWebhookSignature(rawBody, signatureHeader, secretKey, toleranceSeconds = 5) {
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
        let ts = null;
        const signatures = [];
        for (const part of parts) {
            const [key, value] = part.split("=");
            if (key === "ts") {
                ts = value;
            }
            else if (key === "h1") {
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
    }
    catch (err) {
        return {
            isValid: false,
            error: `VERIFICATION_EXCEPTION: ${err?.message || "Unknown error"}`,
        };
    }
}
//# sourceMappingURL=paddleWebhookVerifier.js.map