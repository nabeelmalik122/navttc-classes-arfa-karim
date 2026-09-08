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
exports.runAccessPolicyTests = runAccessPolicyTests;
const crypto = __importStar(require("crypto"));
const accessPolicy_1 = require("./accessPolicy");
const paddle_1 = require("../config/paddle");
const paddleWebhookVerifier_1 = require("./paddleWebhookVerifier");
/**
 * Pure assertion test runner for verification without external test dependencies.
 */
function runAccessPolicyTests() {
    let passed = 0;
    let failed = 0;
    function assert(condition, testName) {
        if (condition) {
            passed++;
            console.log(`  ✓ ${testName}`);
        }
        else {
            failed++;
            console.error(`  ✗ FAIL: ${testName}`);
        }
    }
    console.log("\n==================================================");
    console.log("[RUNNING ACCESS POLICY & SIGNATURE UNIT TESTS]");
    console.log("==================================================");
    // Test 1: Active Subscription
    const activePolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "active",
        planId: "plan_pro",
        currentBillingPeriodEnd: "2026-10-07T12:00:00.000Z",
    });
    assert(activePolicy.accessState === "active" && activePolicy.planId === "plan_pro", "Active subscription grants active access");
    // Test 2: Scheduled Cancellation (before period end)
    const baseTime = new Date("2026-09-07T12:00:00.000Z").getTime();
    const scheduledCancelPolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "active",
        planId: "plan_titan_all_access",
        currentBillingPeriodEnd: "2026-10-07T12:00:00.000Z",
        scheduledChange: { action: "cancel", effectiveAt: "2026-10-07T12:00:00.000Z" },
        currentTimestamp: baseTime,
    });
    assert(scheduledCancelPolicy.accessState === "active" &&
        scheduledCancelPolicy.effectiveUntil === "2026-10-07T12:00:00.000Z", "Scheduled cancellation retains active access until period end");
    // Test 3: Scheduled Cancellation (after period end)
    const afterPeriodEnd = new Date("2026-10-08T12:00:00.000Z").getTime();
    const expiredCancelPolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "active",
        planId: "plan_titan_all_access",
        currentBillingPeriodEnd: "2026-10-07T12:00:00.000Z",
        scheduledChange: { action: "cancel", effectiveAt: "2026-10-07T12:00:00.000Z" },
        currentTimestamp: afterPeriodEnd,
    });
    assert(expiredCancelPolicy.accessState === "canceled", "Scheduled cancellation transitions to canceled after period end");
    // Test 4: Past Due within 72 Hours (Grace Period Active)
    const pastDueTime = new Date("2026-09-07T12:00:00.000Z").toISOString();
    const twentyHoursLater = new Date("2026-09-08T08:00:00.000Z").getTime();
    const gracePolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "past_due",
        planId: "plan_foundation",
        currentBillingPeriodEnd: "2026-09-07T12:00:00.000Z",
        occurredAt: pastDueTime,
        currentTimestamp: twentyHoursLater,
    });
    assert(gracePolicy.accessState === "grace", "Past due event within 72 hours triggers grace period");
    // Test 5: Past Due beyond 72 Hours (Restricted)
    const eightyHoursLater = new Date("2026-09-10T21:00:00.000Z").getTime();
    const restrictedPolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "past_due",
        planId: "plan_foundation",
        currentBillingPeriodEnd: "2026-09-07T12:00:00.000Z",
        occurredAt: pastDueTime,
        currentTimestamp: eightyHoursLater,
    });
    assert(restrictedPolicy.accessState === "restricted", "Past due beyond 72 hours restricts access");
    // Test 6: Paused Subscription (subscription.paused)
    const pausedPolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "paused",
        planId: "plan_pro",
        currentBillingPeriodEnd: "2026-10-07T12:00:00.000Z",
    });
    assert(pausedPolicy.accessState === "restricted", "subscription.paused sets accessState to restricted");
    // Test 7: Resumed Subscription (subscription.resumed returns status to active)
    const resumedPolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "active",
        planId: "plan_pro",
        currentBillingPeriodEnd: "2026-11-07T12:00:00.000Z",
    });
    assert(resumedPolicy.accessState === "active" && resumedPolicy.planId === "plan_pro", "subscription.resumed restores accessState to active");
    // Test 8: Canceled Subscription (subscription.canceled)
    const canceledPolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "canceled",
        planId: "plan_foundation",
        currentBillingPeriodEnd: "2026-09-07T12:00:00.000Z",
    });
    assert(canceledPolicy.accessState === "canceled", "Canceled subscription revokes access to canceled state");
    // Test 9: Unknown / Null Plan ID (Fail Closed)
    const unknownPlanPolicy = (0, accessPolicy_1.computeAccessPolicy)({
        status: "active",
        planId: null,
        currentBillingPeriodEnd: "2026-10-07T12:00:00.000Z",
    });
    assert(unknownPlanPolicy.accessState === "none" && unknownPlanPolicy.planId === null, "Unmapped or missing plan ID fails closed to none");
    // Test 10: Price Mapping Verification
    assert((0, paddle_1.resolveIronxPlanId)("pri_01m1ycsj1fxkmjwzdy6h0f4qq") === "plan_foundation", "Maps Foundation price ID");
    assert((0, paddle_1.resolveIronxPlanId)("pri_01m1yd0jj79agxr785m6pb3jnx") === "plan_pro", "Maps Pro Athlete price ID");
    assert((0, paddle_1.resolveIronxPlanId)("pri_01m1yd44b101sqqsxp79gasdpn") === "plan_titan_all_access", "Maps Titan All-Access price ID");
    assert((0, paddle_1.resolveIronxPlanId)("pri_invalid_unknown") === null, "Unknown price ID returns null (fails closed)");
    // Test 11: Webhook Signature Verification - Valid Payload
    const secret = "pdl_ntfset_test_secret_key_12345";
    const nowTs = Math.floor(Date.now() / 1000).toString();
    const sampleBody = JSON.stringify({ event_id: "evt_01test", event_type: "subscription.activated" });
    const validHash = crypto.createHmac("sha256", secret).update(`${nowTs}:${sampleBody}`).digest("hex");
    const validHeader = `ts=${nowTs};h1=${validHash}`;
    const validVerification = (0, paddleWebhookVerifier_1.verifyPaddleWebhookSignature)(sampleBody, validHeader, secret, 5);
    assert(validVerification.isValid === true, "Valid Paddle HMAC-SHA256 signature is accepted");
    // Test 12: Webhook Signature Verification - Tampered Body
    const tamperedVerification = (0, paddleWebhookVerifier_1.verifyPaddleWebhookSignature)(sampleBody + "tampered", validHeader, secret, 5);
    assert(tamperedVerification.isValid === false, "Tampered payload fails signature verification");
    // Test 13: Webhook Signature Verification - Timestamp Drift > 5s
    const oldTs = (Math.floor(Date.now() / 1000) - 10).toString();
    const oldHash = crypto.createHmac("sha256", secret).update(`${oldTs}:${sampleBody}`).digest("hex");
    const oldHeader = `ts=${oldTs};h1=${oldHash}`;
    const driftVerification = (0, paddleWebhookVerifier_1.verifyPaddleWebhookSignature)(sampleBody, oldHeader, secret, 5);
    assert(driftVerification.isValid === false, "Timestamp drift > 5s is rejected (replay guard)");
    // Test 14: Webhook Signature Verification - Missing Secret (Fail Safe)
    const missingSecretVerification = (0, paddleWebhookVerifier_1.verifyPaddleWebhookSignature)(sampleBody, validHeader, "", 5);
    assert(missingSecretVerification.isValid === false, "Missing secret key fails safely without crash");
    console.log(`\nRESULTS: ${passed} Passed, ${failed} Failed\n`);
    return { passed, failed };
}
// Auto-run if executed directly
if (require.main === module) {
    const { failed } = runAccessPolicyTests();
    if (failed > 0) {
        process.exit(1);
    }
}
//# sourceMappingURL=accessPolicy.test.js.map