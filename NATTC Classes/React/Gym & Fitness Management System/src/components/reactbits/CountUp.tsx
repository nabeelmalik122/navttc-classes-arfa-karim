/**
 * CountUp — React Bits inspired animated number counter.
 * Counts from 0 (or start) to end when element enters viewport.
 * Uses IntersectionObserver for startWhen trigger.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;      // seconds
  separator?: string;     // e.g. ","
  prefix?: string;        // e.g. "$"
  suffix?: string;        // e.g. "%"
  decimals?: number;
  startWhen?: boolean;    // if false, won't animate until set to true
  className?: string;
  onComplete?: () => void;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  separator = ",",
  prefix = "",
  suffix = "",
  decimals = 0,
  startWhen = true,
  className = "",
  onComplete,
}) => {
  const [value, setValue] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const formatValue = useCallback(
    (v: number): string => {
      const fixed = v.toFixed(decimals);
      const parts = fixed.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return `${prefix}${parts.join(".")}${suffix}`;
    },
    [decimals, separator, prefix, suffix]
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
        onComplete?.();
      }
    },
    [start, end, duration, onComplete]
  );

  useEffect(() => {
    if (!startWhen || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();

          if (prefersReduced.current) {
            setValue(end);
            onComplete?.();
          } else {
            startTimeRef.current = null;
            rafRef.current = requestAnimationFrame(animate);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [startWhen, hasStarted, animate, end, onComplete]);

  return (
    <span ref={ref} className={className} aria-live="polite" aria-label={`${prefix}${end}${suffix}`}>
      {formatValue(value)}
    </span>
  );
};

export default CountUp;
