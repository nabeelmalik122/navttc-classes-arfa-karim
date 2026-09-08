import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PaddleService } from "./paddle.service";
import { isPaddleConfigured } from "./paddle.config";
import type { IronxPricingTier, PreviewedPrice } from "./paddle.types";
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";

export function usePaddle() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [priceMap, setPriceMap] = useState<Record<string, PreviewedPrice>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [activeCheckoutTierId, setActiveCheckoutTierId] = useState<string | null>(null);

  const isConfigured = isPaddleConfigured();
  const isOpeningRef = useRef<boolean>(false);

  // Load live localized prices from Paddle PricePreview API
  useEffect(() => {
    let isMounted = true;

    async function loadPreviews() {
      if (!isConfigured) {
        setIsLoadingPrices(false);
        return;
      }

      setIsLoadingPrices(true);
      setPriceError(null);

      try {
        const previews = await PaddleService.fetchPricePreviews();
        if (isMounted) {
          setPriceMap(previews);
          setIsLoadingPrices(false);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("[IRONX Paddle] Live price preview failed:", err);
          setPriceError("Unable to retrieve real-time regional pricing from Paddle Sandbox.");
          setIsLoadingPrices(false);
        }
      }
    }

    loadPreviews();

    return () => {
      isMounted = false;
    };
  }, [isConfigured]);

  const handleSubscribe = useCallback(
    async (tier: IronxPricingTier) => {
      if (isOpeningRef.current) {
        return;
      }

      if (!isConfigured) {
        notify.warning({
          title: "SANDBOX TOKEN REQUIRED",
          message:
            "VITE_PADDLE_CLIENT_TOKEN is not configured in .env.local. Please provide your Paddle Sandbox client-side token.",
          duration: 6000,
        });
        return;
      }

      try {
        isOpeningRef.current = true;
        setActiveCheckoutTierId(tier.id);

        await PaddleService.openCheckout({
          priceId: tier.priceId,
          userEmail: user?.email || null,
          userUid: user?.uid || null,
          onCompleted: () => {
            isOpeningRef.current = false;
            setActiveCheckoutTierId(null);
            notify.info({
              title: "CHECKOUT SUBMITTED",
              message: "Paddle Sandbox transaction processed. Routing to dashboard...",
              duration: 5000,
            });

            if (isAuthenticated) {
              navigate("/member/dashboard");
            } else {
              navigate(`/register?plan=${tier.id}`);
            }
          },
          onClosed: () => {
            isOpeningRef.current = false;
            setActiveCheckoutTierId(null);
          },
          onError: (error) => {
            isOpeningRef.current = false;
            setActiveCheckoutTierId(null);
            console.error("[IRONX Paddle] Checkout error:", error);
            notify.error({
              title: "CHECKOUT ENCOUNTERED AN ISSUE",
              message: "Unable to complete Paddle checkout overlay. Please try again.",
            });
          },
        });
      } catch (err) {
        isOpeningRef.current = false;
        setActiveCheckoutTierId(null);
        console.error("[IRONX Paddle] Failed to open checkout:", err);
        notify.error({
          title: "CHECKOUT INITIALIZATION FAILED",
          message: "Could not open Paddle Sandbox checkout overlay.",
        });
      }
    },
    [isConfigured, user?.email, isAuthenticated, navigate]
  );

  return {
    isConfigured,
    isLoadingPrices,
    priceMap,
    priceError,
    activeCheckoutTierId,
    handleSubscribe,
  };
}
