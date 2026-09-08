/**
 * VORTEX GSAP & SCROLLTRIGGER SCOPED CONTEXT HELPER
 * 
 * Provides safe animation scoping and automatic teardown for React components.
 * Prevents memory leaks, duplicate scroll triggers in React StrictMode,
 * and respects prefers-reduced-motion: reduce.
 */

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered once globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Hook for executing GSAP animations inside a scoped context with automatic cleanup.
 * 
 * @param callback Animation builder receiving the gsap instance
 * @param scope Ref to the root element confining the selectors
 * @param dependencies Optional dependency array triggering re-initialization
 */
export function useGsapContext(
  callback: (context: gsap.Context) => void,
  scope?: RefObject<HTMLElement | null>,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // In reduced-motion mode, skip scroll-driven animations
      return;
    }

    const ctx = gsap.context((self) => {
      callback(self);
    }, scope?.current || undefined);

    return () => {
      ctx.revert(); // Automatically reverts all tweens and kills all ScrollTriggers created within this context
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
