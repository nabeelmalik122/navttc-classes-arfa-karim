/**
 * TextPressure — React Bits inspired font-weight morphing text
 * that reacts to cursor proximity (like pressing down on text).
 * Similar to VariableProximity but word-level, not character-level.
 * Used for the VORTEX cinematic loader wordmark.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

interface TextPressureProps {
  text: string;
  textColor?: string;
  minFontSize?: number;    // px
  maxFontSize?: number;    // px (on hover)
  minWeight?: number;
  maxWeight?: number;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TextPressure: React.FC<TextPressureProps> = ({
  text,
  textColor = "#dfff00",
  minFontSize = 48,
  maxFontSize = 56,
  minWeight = 700,
  maxWeight = 900,
  radius = 100,
  className = "",
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [sizes, setSizes] = useState<number[]>(() => Array(text.length).fill(minFontSize));
  const [weights, setWeights] = useState<number[]>(() => Array(text.length).fill(minWeight));
  const prefersReduced = useRef(false);
  const isTouch = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReduced.current || isTouch.current) return;
      const newSizes: number[] = [];
      const newWeights: number[] = [];

      charRefs.current.forEach((el) => {
        if (!el) { newSizes.push(minFontSize); newWeights.push(minWeight); return; }
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const t = Math.max(0, 1 - dist / radius);
        newSizes.push(minFontSize + (maxFontSize - minFontSize) * t);
        newWeights.push(minWeight + (maxWeight - minWeight) * t);
      });

      setSizes(newSizes);
      setWeights(newWeights);
    },
    [minFontSize, maxFontSize, minWeight, maxWeight, radius]
  );

  const handleMouseLeave = useCallback(() => {
    setSizes(Array(text.length).fill(minFontSize));
    setWeights(Array(text.length).fill(minWeight));
  }, [text.length, minFontSize, minWeight]);

  useEffect(() => {
    if (prefersReduced.current || isTouch.current) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div ref={containerRef} className={`inline-flex items-baseline ${className}`} style={style}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          style={{
            color: textColor,
            fontSize: `${sizes[i]}px`,
            fontWeight: weights[i],
            display: "inline-block",
            transition: "font-size 0.1s ease-out, font-weight 0.1s ease-out",
            willChange: "font-size, font-weight",
            lineHeight: 1,
          }}
          aria-hidden={i > 0}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default TextPressure;
