import { useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from '../gsap';

/**
 * useGSAPContext: Safe GSAP timeline management inside React 18+ components.
 * Guarantees all tweens/scrolltriggers are properly reverted upon unmount.
 */
export function useGSAPContext(
  animationCallback: (context: gsap.Context) => void,
  scopeRef?: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  const contextRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    const scope = scopeRef?.current ?? undefined;
    const ctx = gsap.context((c) => {
      animationCallback(c);
    }, scope);

    contextRef.current = ctx;

    return () => {
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return contextRef;
}
