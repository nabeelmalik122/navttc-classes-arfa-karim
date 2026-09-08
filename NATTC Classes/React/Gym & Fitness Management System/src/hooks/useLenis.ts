import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * useLenis — Initializes Lenis smooth scroll at the application root.
 *
 * - Runs a requestAnimationFrame loop for buttery physics-based scrolling.
 * - Cleans up on unmount (router navigation, HMR reloads).
 * - Returns the Lenis instance for future scroll-triggered animations (GSAP ScrollTrigger, etc.).
 *
 * Usage: Call once at the App root. Do NOT call in child components.
 */
export function useLenis(): Lenis | null {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef.current;
}

export default useLenis;
