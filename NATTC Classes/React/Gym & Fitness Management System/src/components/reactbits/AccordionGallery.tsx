/**
 * AccordionGallery — React Bits inspired horizontal accordion gallery.
 * Items expand on hover to reveal full image + label.
 * Falls back to vertical on mobile.
 */

import React, { useState } from "react";
import "./AccordionGallery.css";

export interface AccordionGalleryItem {
  id: string;
  image: string;
  label: string;
  sublabel?: string;
  category?: string;
}

interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
  accentColor?: string;
  height?: string;         // CSS height of the accordion
  className?: string;
}

export const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items,
  accentColor = "#dfff00",
  height = "clamp(320px, 55vh, 520px)",
  className = "",
}) => {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      {/* Desktop: horizontal accordion */}
      <div
        className={`accordion-gallery hidden md:flex items-stretch gap-2 overflow-hidden rounded-2xl ${className}`}
        style={{ height }}
        role="list"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              role="listitem"
              className="accordion-gallery-item relative overflow-hidden cursor-pointer flex-shrink-0 rounded-xl border border-[var(--color-border-subtle)]"
              style={{
                flex: isActive ? "5 1 0%" : "1 1 0%",
                transition: prefersReduced ? "none" : "flex 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              tabIndex={0}
              aria-label={item.label}
              aria-expanded={isActive}
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/30 to-transparent" />

              {/* Vertical label (collapsed state) */}
              {!isActive && (
                <div
                  className="absolute inset-0 flex items-end pb-4 justify-center"
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-text-secondary)] rotate-180 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              )}

              {/* Expanded content */}
              <div
                className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-300"
                style={{ opacity: isActive ? 1 : 0, transition: prefersReduced ? "none" : undefined }}
              >
                {item.category && (
                  <div
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest mb-2"
                    style={{ background: accentColor, color: "#08080a" }}
                  >
                    {item.category}
                  </div>
                )}
                <h3 className="text-lg font-black uppercase text-white font-heading leading-tight">
                  {item.label}
                </h3>
                {item.sublabel && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                    {item.sublabel}
                  </p>
                )}
              </div>

              {/* Accent corner dot */}
              {isActive && (
                <div
                  className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
                  style={{ background: accentColor }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical grid */}
      <div className="md:hidden grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative rounded-xl overflow-hidden border border-[var(--color-border-subtle)] h-52"
          >
            <img src={item.image} alt={item.label} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a]/90 to-transparent" />
            <div className="absolute bottom-4 left-4">
              {item.category && (
                <div
                  className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest mb-1"
                  style={{ background: accentColor, color: "#08080a" }}
                >
                  {item.category}
                </div>
              )}
              <h3 className="text-sm font-bold uppercase text-white font-heading">{item.label}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AccordionGallery;
