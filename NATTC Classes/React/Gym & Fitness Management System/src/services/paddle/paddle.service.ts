import { initializePaddle, type Paddle, type PaddleEventData } from "@paddle/paddle-js";
import {
  IRONX_TIERS,
  getPaddleClientToken,
  getPaddleEnvironment,
  isPaddleConfigured,
} from "./paddle.config";
import type { PreviewedPrice } from "./paddle.types";

let paddlePromise: Promise<Paddle | undefined> | null = null;
let currentEventCallback: ((event: PaddleEventData) => void) | null = null;

export class PaddleService {
  /**
   * Initialize or retrieve the cached singleton Paddle.js instance.
   */
  static async getInstance(): Promise<Paddle | undefined> {
    if (!isPaddleConfigured()) {
      console.warn(
        "[IRONX Paddle] VITE_PADDLE_CLIENT_TOKEN is not set. Paddle initialization deferred."
      );
      return undefined;
    }

    if (!paddlePromise) {
      const token = getPaddleClientToken();
      const environment = getPaddleEnvironment();

      paddlePromise = initializePaddle({
        environment,
        token,
        eventCallback: (event) => {
          if (currentEventCallback) {
            currentEventCallback(event);
          }
        },
      });
    }

    return paddlePromise;
  }

  /**
   * Set dynamic event callback handler for checkout lifecycle events
   */
  static setEventCallback(callback: ((event: PaddleEventData) => void) | null) {
    currentEventCallback = callback;
  }

  /**
   * Fetches real-time localized price preview from Paddle for all catalog tiers.
   * Does not perform client calculations or hardcoded currency translations.
   */
  static async fetchPricePreviews(): Promise<Record<string, PreviewedPrice>> {
    const paddle = await this.getInstance();
    if (!paddle) {
      throw new Error("PADDLE_NOT_CONFIGURED");
    }

    const items = IRONX_TIERS.map((tier) => ({
      priceId: tier.priceId,
      quantity: 1,
    }));

    try {
      const response = await paddle.PricePreview({ items });
      const priceMap: Record<string, PreviewedPrice> = {};

      if (response && response.data && response.data.details && response.data.details.lineItems) {
        response.data.details.lineItems.forEach((item) => {
          if (item.price && item.price.id) {
            const formattedTotal =
              item.formattedTotals?.total ||
              item.formattedUnitTotals?.total ||
              item.price.unitPrice?.amount;

            priceMap[item.price.id] = {
              priceId: item.price.id,
              formattedTotal: formattedTotal || `$${item.price.unitPrice?.amount || ""}`,
              currencyCode: response.data.currencyCode || "USD",
              rawTotal: item.totals?.total,
            };
          }
        });
      }

      return priceMap;
    } catch (err) {
      console.error("[IRONX Paddle] PricePreview retrieval failed:", err);
      throw err;
    }
  }

  /**
   * Opens Paddle Sandbox Checkout in Overlay mode.
   */
  static async openCheckout(options: {
    priceId: string;
    userEmail?: string | null;
    userUid?: string | null;
    onCompleted?: (data?: PaddleEventData) => void;
    onClosed?: () => void;
    onError?: (error: unknown) => void;
  }): Promise<void> {
    const paddle = await this.getInstance();
    if (!paddle) {
      throw new Error("PADDLE_NOT_CONFIGURED");
    }

    // Register active lifecycle listener for this checkout session
    this.setEventCallback((event) => {
      if (event.name === "checkout.completed") {
        options.onCompleted?.(event);
      } else if (event.name === "checkout.closed") {
        options.onClosed?.();
      } else if (event.name === "checkout.error" || event.name === "checkout.failed") {
        options.onError?.(event);
      }
    });

    const openOptions: Parameters<typeof paddle.Checkout.open>[0] = {
      settings: {
        displayMode: "overlay",
        variant: "one-page",
      },
      items: [
        {
          priceId: options.priceId,
          quantity: 1,
        },
      ],
    };

    if (options.userEmail && options.userEmail.trim().length > 0) {
      openOptions.customer = {
        email: options.userEmail.trim(),
      };
    }

    if (options.userUid && options.userUid.trim().length > 0) {
      openOptions.customData = {
        ironx_uid: options.userUid.trim(),
      };
    }

    paddle.Checkout.open(openOptions);
  }
}
