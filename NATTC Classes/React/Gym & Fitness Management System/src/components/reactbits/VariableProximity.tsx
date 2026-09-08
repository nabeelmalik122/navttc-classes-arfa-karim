/**
 * VariableProximity — React Bits inspired variable font weight
 * effect driven by cursor proximity to each character.
 * Works with fonts that support font-weight variable axis.
 */

import React, { useRef, useState, useCallback, useEffect } from "react";

interface VariableProximityProps {
  text: string;
  className?: string;
  minWeight?: number;     // font-weight when far from cursor
  maxWeight?: number;     // font-weight when cursor is on character
  radius?: number;        // px radius of influence
  falloffCurve?: number;  // 1 = linear, 2 = quadratic, etc.
}

export const VariableProximity: React.FC<VariableProximityProps> = ({
  text,
  className = "",
  minWeight = 400,
  maxWeight = 900,
  radius = 120,
  falloffCurve = 2,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [weights, setWeights] = useState<number[]>(() => Array(text.length).fill(minWeight));
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReduced = useRef(false);
  const isTouch = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReduced.current || isTouch.current) return;

      const newWeights = charRefs.current.map((el) => {
        if (!el) return minWeight;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist >= radius) return minWeight;
        const t = 1 - dist / radius;
        const eased = Math.pow(t, falloffCurve);
        return minWeight + (maxWeight - minWeight) * eased;
      });

      setWeights(newWeights);
    },
    [minWeight, maxWeight, radius, falloffCurve]
  );

  const handleMouseLeave = useCallback(() => {
    setWeights(Array(text.length).fill(minWeight));
  }, [text.length, minWeight]);

  useEffect(() => {
    if (prefersReduced.current || isTouch.current) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // On mobile, just render static text
  if (isTouch.current || prefersReduced.current) {
    return <span className={className}>{text}</span>;
  }

  // Split into words, each containing characters so words never break awkwardly mid-word
  const words = text.split(" ");
  let charIndexOffset = 0;

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {words.map((word, wordIdx) => {
        const startIndex = charIndexOffset;
        charIndexOffset += word.length + 1; // account for space

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIdx) => {
              const globalIdx = startIndex + charIdx;
              return (
                <span
                  key={charIdx}
                  ref={(el) => {
                    charRefs.current[globalIdx] = el;
                  }}
                  style={{
                    fontWeight: weights[globalIdx] || minWeight,
                    display: "inline-block",
                    transition: "font-weight 0.15s ease-out",
                    willChange: "font-weight",
                  }}
                  aria-hidden="true"
                >
                  {char}
                </span>
              );
            })}
            {wordIdx < words.length - 1 && (
              <span
                ref={(el) => {
                  charRefs.current[startIndex + word.length] = el;
                }}
                style={{
                  fontWeight: weights[startIndex + word.length] || minWeight,
                  display: "inline",
                  transition: "font-weight 0.15s ease-out",
                }}
                aria-hidden="true"
              >
                {"\u00A0"}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};

export default VariableProximity;
