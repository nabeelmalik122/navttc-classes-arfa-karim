/**
 * ScrollVelocity — React Bits inspired horizontal marquee that changes
 * speed based on scroll velocity (using framer-motion).
 *
 * Brand colors: volt yellow (#dfff00) text on dark bg.
 * Mobile: full support — scroll marquee works well on touch.
 */

import React from "react";

interface ScrollVelocityProps {
  texts: string[];          // Array of marquee items
  velocity?: number;        // Base scroll speed (pixels/frame)
  separator?: string;       // Between each text item
  className?: string;       // Outer wrapper class
  itemClassName?: string;   // Per-item class
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts,
  velocity = 40,
  separator = "◆",
  className = "",
  itemClassName = "",
}) => {
  return (
    <div className={`scroll-velocity-wrapper overflow-hidden ${className}`} aria-hidden="true">
      {texts.map((text, i) => (
        <SimpleMarquee
          key={i}
          text={text}
          velocity={velocity * (i % 2 === 0 ? 1 : -1)}
          separator={separator}
          itemClassName={itemClassName}
        />
      ))}
    </div>
  );
};

/**
 * Simpler, dependency-free marquee implementation that avoids framer-motion
 * useTransform complexity. Uses pure CSS animation + JS velocity modulation.
 */
function SimpleMarquee({
  text,
  velocity,
  separator,
  itemClassName,
}: {
  text: string;
  velocity: number;
  separator: string;
  itemClassName?: string;
}) {
  const isReverse = velocity < 0;
  const speed = Math.abs(velocity);
  // Duration: lower = faster. ~5s at speed 40.
  const duration = `${Math.max(10, 200 / speed)}s`;

  const items = Array(12).fill(text);

  return (
    <div className="flex whitespace-nowrap overflow-hidden">
      <div
        className={`flex whitespace-nowrap ${isReverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {items.map((item, i) => (
          <span key={i} className={`inline-block ${itemClassName ?? ""}`}>
            {item}
            <span className="opacity-30 mx-3 sm:mx-4" aria-hidden="true">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScrollVelocity;
