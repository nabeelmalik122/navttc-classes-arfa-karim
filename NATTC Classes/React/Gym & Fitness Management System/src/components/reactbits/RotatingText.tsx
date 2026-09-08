/**
 * RotatingText — React Bits inspired word rotation with smooth
 * slide-up/slide-down transition using framer-motion.
 */

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  interval?: number;       // ms between rotations
  className?: string;      // Applied to each word
  transition?: Transition;
}

export const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  interval = 2500,
  className = "",
  transition = { duration: 0.4, ease: "easeInOut" },
}) => {
  const [index, setIndex] = useState(0);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval, prefersReduced]);

  if (prefersReduced) {
    return <span className={className}>{texts[0]}</span>;
  }

  return (
    <span
      className="rotating-text-wrapper inline-block overflow-hidden align-bottom"
      style={{
        verticalAlign: "bottom",
        height: "1.15em",
        lineHeight: "1.15em",
      }}
      aria-live="polite"
      aria-label={texts[index]}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          className={`rotating-text-item block ${className}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={transition}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
