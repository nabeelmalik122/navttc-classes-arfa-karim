# GSAP Animation Guidelines & Standards

## 1. Principles
1. **Performance First**: Animate strictly with `transform` (`x`, `y`, `scale`, `rotation`) and `opacity`. Never animate layout triggers like `height`, `top`, or `padding` directly.
2. **React Strict Mode Safety**: All GSAP timelines, tweens, and ScrollTriggers inside React components MUST be instantiated within `useGSAP` or wrapped in a `gsap.context()` with an explicit `ctx.revert()` in the cleanup function.
3. **Accessibility**: Honor `prefers-reduced-motion`. If reduced motion is requested, instantly jump to the final timeline state.

## 2. Standard Motion Durations & Easing
- **Micro-interactions (hover, magnetic snap)**: `duration: 0.3s`, `ease: "power3.out"`
- **Modal & Drawer Entries**: `duration: 0.5s`, `ease: "power4.out"`
- **Page Transitions**: `duration: 0.6s`, `ease: "expo.inOut"`
- **Metric Counter Interpolation**: `duration: 1.2s`, `ease: "power2.out"`

## 3. Kinetic Hooks Catalog
- `useGSAPContext(scopeRef)`: Automatically scopes selectors and cleans up on unmount.
- `useMagneticEffect(elementRef, strength)`: Physics-based cursor gravity for luxury CTA buttons.
- `useTextReveal(elementRef)`: Staggered kinetic typography reveal for headlines.
- `useScrollReveal(elementRef, triggerOptions)`: ScrollTrigger-backed viewport enter animations.
