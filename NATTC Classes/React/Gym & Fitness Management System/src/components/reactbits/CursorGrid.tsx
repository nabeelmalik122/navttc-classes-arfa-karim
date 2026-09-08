/**
 * CursorGrid — React Bits inspired interactive canvas grid.
 * Cells near the cursor glow with brand yellow.
 * Completely hidden on mobile (no cursor on touch).
 * Reduced motion: static grid only.
 */

import React, { useRef, useEffect, useCallback } from "react";

interface CursorGridProps {
  color?: string;        // Glow color (CSS hex)
  cellSize?: number;     // Grid cell size in px
  radius?: number;       // Glow radius in px
  gridOpacity?: number;  // Base grid line opacity (0-1)
  glowOpacity?: number;  // Max glow opacity (0-1)
  className?: string;
}

export const CursorGrid: React.FC<CursorGridProps> = ({
  color = "#dfff00",
  cellSize = 40,
  radius = 140,
  gridOpacity = 0.04,
  glowOpacity = 0.18,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useRef(false);
  const isTouch = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  // Parse hex color to r,g,b
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 223, g: 255, b: 0 };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { r, g, b } = hexToRgb(color);
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid lines
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${gridOpacity})`;
    ctx.lineWidth = 1;

    for (let x = 0; x <= w; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw cursor glow if mouse is present
    if (mouseRef.current && !prefersReduced.current && !isTouch.current) {
      const { x, y } = mouseRef.current;
      const startCol = Math.floor((x - radius) / cellSize);
      const endCol = Math.ceil((x + radius) / cellSize);
      const startRow = Math.floor((y - radius) / cellSize);
      const endRow = Math.ceil((y + radius) / cellSize);

      for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
          const cellX = col * cellSize;
          const cellY = row * cellSize;
          const centerX = cellX + cellSize / 2;
          const centerY = cellY + cellSize / 2;
          const dist = Math.hypot(centerX - x, centerY - y);

          if (dist < radius) {
            const alpha = (1 - dist / radius) * glowOpacity;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2);
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [color, cellSize, radius, gridOpacity, glowOpacity, hexToRgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = null; };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [draw]);

  // Hide on mobile entirely
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`cursor-grid-container absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full hidden sm:block"
      />
    </div>
  );
};

export default CursorGrid;
