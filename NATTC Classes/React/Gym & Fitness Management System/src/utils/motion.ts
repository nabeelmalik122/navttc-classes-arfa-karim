/**
 * VORTEX MOTION TOKENS & INTERACTION SYSTEM
 * 
 * Hierarchy:
 * - Level 1: Micro-interaction (120ms - 220ms): Button presses, link hovers, active indicator shifts.
 * - Level 2: Component & Section (250ms - 600ms): Dialog entrances, section reveals, mobile drawer.
 * - Level 3: Signature Storytelling: Scroll-linked public choreography, Hero monolith coordination.
 * 
 * Mandatory: Strictly respects prefers-reduced-motion: reduce.
 */

import { useState, useEffect } from "react";
import type { Variants, Transition } from "framer-motion";

export const MOTION_TOKENS = {
  duration: {
    micro: 0.15,      // 150ms
    normal: 0.25,     // 250ms
    component: 0.35,  // 350ms
    reveal: 0.5,      // 500ms
    cinematic: 0.75,  // 750ms
  },
  ease: {
    // Sharp athletic deceleration (decelerate into rest)
    out: [0.16, 1, 0.3, 1] as const,
    // Smooth standard transition
    standard: [0.2, 0, 0, 1] as const,
    // Accelerated entrance and decelerated exit
    inOut: [0.65, 0, 0.35, 1] as const,
    // Restrained, non-bouncy physical spring for tactile feedback
    spring: { type: "spring", stiffness: 320, damping: 26 } as const,
    subtleSpring: { type: "spring", stiffness: 240, damping: 22 } as const,
  },
  stagger: {
    tight: 0.04,  // 40ms
    normal: 0.07, // 70ms
    relaxed: 0.1, // 100ms max
  },
};

/**
 * Custom React hook detecting user preference for reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}

/**
 * Level 2: Section & Card Reveal Variants
 * Subtle vertical movement (16px) and opacity transition without aggressive layout jumps.
 */
export const sectionRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKENS.duration.reveal,
      ease: MOTION_TOKENS.ease.out,
    },
  },
};

/**
 * Level 2: Stagger Container Variants
 * Coordinates children entrance with controlled, short intervals.
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_TOKENS.stagger.normal,
      delayChildren: 0.05,
    },
  },
};

/**
 * Pure Fade-in without translation (ideal for modals, overlays, and reduced motion).
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION_TOKENS.duration.normal,
      ease: "easeOut",
    },
  },
};

/**
 * Level 1: Micro-interaction Button Press Variant
 */
export const buttonPressTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};
