/**
 * GlareHover — React Bits inspired glare shine effect on hover.
 * A diagonal "light streak" passes over the wrapped child on mouse enter.
 * Disabled automatically on touch/coarse pointer devices.
 */

import React, { useRef, useState, useEffect } from "react";

interface GlareHoverProps {
  children: React.ReactNode;
  glareColor?: string;         // CSS color, default #dfff00
  glareOpacity?: number;       // 0–1
  glareAngle?: number;         // degrees, negative = top-right to bottom-left
  glareSize?: number;          // percent width of glare streak
  transitionDuration?: number; // ms
  className?: string;
  style?: React.CSSProperties;
}

export const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = "#dfff00",
  glareOpacity = 0.2,
  glareAngle = -30,
  glareSize = 40,
  transitionDuration = 600,
  className = "",
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isTouch = useRef(false);
  const prefersReduced = useRef(false);

  useEffect(() => {
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch.current || prefersReduced.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (!isTouch.current && !prefersReduced.current) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos(null);
  };

  const glareStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "inherit",
    zIndex: 30,
    opacity: isHovered ? glareOpacity : 0,
    transition: `opacity ${transitionDuration}ms ease`,
    background: mousePos
      ? `linear-gradient(
          ${glareAngle}deg,
          transparent ${mousePos.x - glareSize / 2}%,
          ${glareColor} ${mousePos.x}%,
          transparent ${mousePos.x + glareSize / 2}%
        )`
      : `linear-gradient(${glareAngle}deg, transparent 40%, ${glareColor} 50%, transparent 60%)`,
    mixBlendMode: "overlay",
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
        <div style={glareStyle} aria-hidden="true" />
      </div>
    </div>
  );
};

export default GlareHover;
