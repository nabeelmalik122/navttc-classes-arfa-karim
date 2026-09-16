import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Global GSAP defaults
gsap.defaults({
  duration: 0.6,
  ease: 'power3.out',
});

export const EASINGS = {
  EXPO_OUT: 'expo.out',
  EXPO_IN_OUT: 'expo.inOut',
  POWER4_OUT: 'power4.out',
  POWER2_OUT: 'power2.out',
  SPRING: 'elastic.out(1, 0.75)',
} as const;

export { gsap, ScrollTrigger };
export default gsap;
