import gsap from '../gsap';

export const animationPresets = {
  fadeInUp: (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power3.out' }
    );
  },

  staggerCards: (elements: gsap.TweenTarget, stagger = 0.08) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 25, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger, ease: 'power3.out' }
    );
  },

  metricCounter: (
    targetObj: { val: number },
    endVal: number,
    onUpdateCallback: (val: number) => void
  ) => {
    return gsap.to(targetObj, {
      val: endVal,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => onUpdateCallback(Math.round(targetObj.val)),
    });
  },
};
