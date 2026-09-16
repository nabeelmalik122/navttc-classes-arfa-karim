import { useEffect, type RefObject } from 'react';
import gsap from '../gsap';

interface MagneticOptions {
  strength?: number;
  ease?: string;
  duration?: number;
}

/**
 * useMagneticEffect: Gives any element physical magnetic pull toward the mouse cursor.
 * Used for Awwwards-caliber CTA buttons and badges.
 */
export function useMagneticEffect(
  targetRef: RefObject<HTMLElement | null>,
  options: MagneticOptions = {}
) {
  const { strength = 0.35, ease = 'power3.out', duration = 0.5 } = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration,
        ease,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [targetRef, strength, ease, duration]);
}
