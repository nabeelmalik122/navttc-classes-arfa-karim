/**
 * DepthCarousel — React Bits inspired 3D depth perspective carousel.
 * Shows adjacent items with depth/scale falloff.
 * Touch swipe supported. Keyboard navigable.
 * Mobile: reduced 3D depth, touch events.
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import "./DepthCarousel.css";

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

interface DepthCarouselProps {
  items: CarouselItem[];
  visibleCount?: number;   // Cards visible at once (default 3)
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export const DepthCarousel: React.FC<DepthCarouselProps> = ({
  items,
  visibleCount = 3,
  autoPlay = false,
  autoPlayInterval = 4000,
  className = "",
}) => {
  const [active, setActive] = useState(Math.floor(items.length / 2));
  const touchStartX = useRef<number | null>(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % items.length);
  }, [items.length]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || prefersReduced.current) return;
    const interval = setInterval(next, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, next]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = index - active;
    const absOffset = Math.abs(offset);
    const side = offset > 0 ? 1 : -1;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (absOffset > Math.floor(visibleCount / 2) + 1) {
      return { opacity: 0, pointerEvents: "none", display: "none" };
    }

    const translateX = isMobile
      ? `${offset * 85}%`
      : `${offset * 68}%`;
    const translateZ = `${-absOffset * (isMobile ? 60 : 100)}px`;
    const scale = Math.pow(0.82, absOffset);
    const opacity = absOffset === 0 ? 1 : Math.max(0, 1 - absOffset * 0.35);
    const zIndex = items.length - absOffset;
    const brightness = absOffset === 0 ? 1 : Math.max(0.5, 1 - absOffset * 0.2);

    return {
      transform: `translateX(${translateX}) translateZ(${translateZ}) scale(${scale})`,
      opacity,
      zIndex,
      filter: `brightness(${brightness})`,
      pointerEvents: absOffset === 0 ? "auto" : "none",
      transition: prefersReduced.current
        ? "none"
        : `transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, filter 0.4s ease`,
    };
  };

  return (
    <div
      className={`depth-carousel-wrapper relative ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Carousel"
    >
      {/* Track */}
      <div
        className="depth-carousel-track relative flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="depth-carousel-card absolute"
            style={getCardStyle(i)}
            onClick={() => { if (i !== active) setActive(i); }}
            aria-current={i === active ? "true" : undefined}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={prev}
          className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] hover:border-[#dfff00] hover:text-[#dfff00] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00]"
          aria-label="Previous"
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] ${
                i === active
                  ? "w-6 h-2 bg-[#dfff00]"
                  : "w-2 h-2 bg-[var(--color-border-active)] hover:bg-[var(--color-text-muted)]"
              }`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] hover:border-[#dfff00] hover:text-[#dfff00] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00]"
          aria-label="Next"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default DepthCarousel;
