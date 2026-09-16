import { type RefObject } from 'react';
import gsap from '../gsap';
import { useGSAPContext } from './useGSAPContext';

interface TextRevealOptions {
  delay?: number;
  stagger?: number;
  duration?: number;
}

/**
 * useTextReveal: Performs kinetic staggered typography reveal on mount.
 */
export function useTextReveal(
  containerRef: RefObject<HTMLElement | null>,
  options: TextRevealOptions = {}
) {
  const { delay = 0.1, stagger = 0.05, duration = 0.8 } = options;

  useGSAPContext(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('[data-reveal-item]');
    if (!items.length) return;

    gsap.fromTo(
      items,
      { y: 40, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration,
        stagger,
        delay,
        ease: 'power4.out',
      }
    );
  }, containerRef);
}
