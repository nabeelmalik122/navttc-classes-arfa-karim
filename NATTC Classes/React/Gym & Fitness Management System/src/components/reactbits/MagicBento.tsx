/**
 * MagicBento — React Bits inspired bento grid with cursor spotlight,
 * border glow, and tilt effect.
 *
 * Brand colors: #dfff00 glow on hover.
 * Mobile: tilt disabled on touch devices.
 * Reduced motion: spotlight kept, tilt/transition disabled.
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import "./MagicBento.css";

export interface BentoItem {
  id: string;
  className?: string;
  children: React.ReactNode;
}

interface MagicBentoProps {
  items: BentoItem[];
  /** Grid layout class, e.g. "grid-cols-2 grid-rows-3" */
  gridClassName?: string;
  glowColor?: string;          // RGB, e.g. "223, 255, 0"
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  tiltMaxDeg?: number;
  className?: string;
}

interface CardState {
  spotlight: { x: number; y: number };
  tilt: { x: number; y: number };
  isHovered: boolean;
}

const DEFAULT_GLOW = "223, 255, 0";

export const MagicBento: React.FC<MagicBentoProps> = ({
  items,
  gridClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  glowColor = DEFAULT_GLOW,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  tiltMaxDeg = 8,
  className = "",
}) => {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(new Map());
  const prefersReducedMotion = useRef(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    isTouchDevice.current =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, id: string) => {
      const card = cardRefs.current.get(id);
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * 2;

      const shouldTilt =
        enableTilt &&
        !isTouchDevice.current &&
        !prefersReducedMotion.current;

      setCardStates((prev) => {
        const next = new Map(prev);
        next.set(id, {
          spotlight: { x, y },
          tilt: shouldTilt
            ? { x: -yPct * tiltMaxDeg, y: xPct * tiltMaxDeg }
            : { x: 0, y: 0 },
          isHovered: true,
        });
        return next;
      });
    },
    [enableTilt, tiltMaxDeg]
  );

  const handleMouseLeave = useCallback((id: string) => {
    setCardStates((prev) => {
      const next = new Map(prev);
      next.set(id, { spotlight: { x: 0, y: 0 }, tilt: { x: 0, y: 0 }, isHovered: false });
      return next;
    });
  }, []);

  return (
    <div className={`grid gap-4 ${gridClassName} ${className}`}>
      {items.map((item) => {
        const state = cardStates.get(item.id);
        const isHovered = state?.isHovered ?? false;
        const spotlight = state?.spotlight ?? { x: 0, y: 0 };
        const tilt = state?.tilt ?? { x: 0, y: 0 };

        const spotlightStyle: React.CSSProperties = enableSpotlight && isHovered
          ? {
              background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, rgba(${glowColor}, 0.12), transparent 70%)`,
            }
          : {};

        const borderGlowStyle: React.CSSProperties = enableBorderGlow && isHovered
          ? {
              boxShadow: `0 0 0 1px rgba(${glowColor}, 0.4), 0 20px 40px rgba(0,0,0,0.4)`,
            }
          : {};

        const tiltStyle: React.CSSProperties =
          !prefersReducedMotion.current && !isTouchDevice.current
            ? {
                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.015 : 1})`,
                transition: isHovered
                  ? "transform 0.05s ease-out"
                  : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
              }
            : {};

        return (
          <div
            key={item.id}
            ref={(el) => {
              if (el) cardRefs.current.set(item.id, el);
              else cardRefs.current.delete(item.id);
            }}
            className={`magic-bento-card relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] transition-colors duration-300 ${item.className ?? ""}`}
            style={{ ...tiltStyle, ...borderGlowStyle }}
            onMouseMove={(e) => handleMouseMove(e, item.id)}
            onMouseLeave={() => handleMouseLeave(item.id)}
          >
            {/* Spotlight overlay */}
            {enableSpotlight && (
              <div
                className="magic-bento-spotlight pointer-events-none absolute inset-0 rounded-2xl z-10"
                style={spotlightStyle}
                aria-hidden="true"
              />
            )}

            {/* Card content */}
            <div className="relative z-20">{item.children}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MagicBento;
