/**
 * FuzzyText — React Bits inspired canvas-based fuzzy/noise text effect.
 * "404" or any short text rendered with pixel noise on hover.
 * Uses #dfff00 as brand color.
 */

import React, { useRef, useEffect, useCallback } from "react";

interface FuzzyTextProps {
  text: string;
  fontSize?: string;         // CSS font-size (clamp, rem, etc.)
  color?: string;            // Text color
  baseIntensity?: number;    // Noise intensity at rest (0–0.5)
  hoverIntensity?: number;   // Noise intensity on hover (0–1)
  enableHover?: boolean;
  fontFamily?: string;
  fontWeight?: string | number;
  className?: string;
}

export const FuzzyText: React.FC<FuzzyTextProps> = ({
  text,
  fontSize = "clamp(4rem, 15vw, 12rem)",
  color = "#dfff00",
  baseIntensity = 0.15,
  hoverIntensity = 0.5,
  enableHover = true,
  fontFamily = "'Outfit', 'Space Grotesk', sans-serif",
  fontWeight = 900,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const rafRef = useRef<number>(0);
  const intensityRef = useRef(baseIntensity);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced.current) intensityRef.current = 0;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Resolve actual font size from CSS clamp
    const computedSize = wrapperRef.current
      ? parseFloat(window.getComputedStyle(wrapperRef.current).fontSize)
      : 96;

    ctx.font = `${fontWeight} ${computedSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const currentIntensity = intensityRef.current;

    if (currentIntensity < 0.01) {
      ctx.fillText(text, w / 2, h / 2);
    } else {
      // Draw text to offscreen, then add noise
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const oCtx = offscreen.getContext("2d")!;
      oCtx.font = ctx.font;
      oCtx.fillStyle = color;
      oCtx.textAlign = "center";
      oCtx.textBaseline = "middle";
      oCtx.fillText(text, w / 2, h / 2);

      ctx.drawImage(offscreen, 0, 0);

      // Get pixel data and add noise on text pixels
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 10) {
          const noise = (Math.random() * 2 - 1) * currentIntensity * 255;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Smoothly interpolate intensity
    const target = isHovered.current ? hoverIntensity : baseIntensity;
    if (prefersReduced.current) {
      intensityRef.current = 0;
    } else {
      intensityRef.current += (target - intensityRef.current) * 0.08;
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [text, color, baseIntensity, hoverIntensity, fontFamily, fontWeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resize = () => {
      // Size canvas to fit text
      const tempDiv = document.createElement("div");
      tempDiv.style.cssText = `
        position: absolute; visibility: hidden; white-space: nowrap;
        font: ${fontWeight} ${fontSize} ${fontFamily};
        font-size: ${fontSize};
      `;
      tempDiv.textContent = text;
      document.body.appendChild(tempDiv);
      const w = tempDiv.offsetWidth + 40;
      const h = tempDiv.offsetHeight + 20;
      document.body.removeChild(tempDiv);
      canvas.width = Math.min(w, window.innerWidth * 0.95);
      canvas.height = h;
    };

    resize();
    window.addEventListener("resize", resize);

    const onEnter = () => { if (enableHover) isHovered.current = true; };
    const onLeave = () => { isHovered.current = false; };
    wrapper.addEventListener("mouseenter", onEnter);
    wrapper.addEventListener("mouseleave", onLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      wrapper.removeEventListener("mouseenter", onEnter);
      wrapper.removeEventListener("mouseleave", onLeave);
    };
  }, [draw, text, fontSize, fontFamily, fontWeight, enableHover]);

  return (
    <div
      ref={wrapperRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize }} // for computed size reference
    >
      <canvas
        ref={canvasRef}
        className="max-w-full"
        aria-label={text}
        role="img"
      />
    </div>
  );
};

export default FuzzyText;
