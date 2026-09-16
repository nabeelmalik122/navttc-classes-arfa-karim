import React, { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap, { ScrollTrigger } from '@/animations/gsap';

interface GSAPProviderProps {
  children: ReactNode;
}

export const GSAPProvider: React.FC<GSAPProviderProps> = ({ children }) => {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(1000, 16);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
