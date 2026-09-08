import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { AccordionGallery, type AccordionGalleryItem } from "@/components/reactbits";

const GALLERY_ITEMS = [
  {
    id: "gal_01",
    category: "iron",
    title: "Heavy Iron Vault & Eleiko Platforms",
    subtitle: "Calibrated competition discs & IPF combo racks",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal_02",
    category: "recovery",
    title: "Finnish Dry Sauna & Cold Plunge Suite",
    subtitle: "Contrast therapy chambers with 3°C filtered hydrotherapy",
    imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal_03",
    category: "combat",
    title: "Combat Arena & Heavy Bags",
    subtitle: "Custom leather water bags & competition padded canvas",
    imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal_04",
    category: "turf",
    title: "High-Velocity Turf Sprint Track",
    subtitle: "Prowler sled lanes & sprint acceleration timing gates",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal_05",
    category: "iron",
    title: "Dumbbell Vault (5kg - 75kg)",
    subtitle: "Solid steel urethane machined dumbbells",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "gal_06",
    category: "recovery",
    title: "Hyperbaric Oxygen Lounge",
    subtitle: "Targeted cell oxygenation for deep tissue repair",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80"
  }
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "iron" | "recovery" | "combat" | "turf">("all");

  const filtered = GALLERY_ITEMS.filter((item) => filter === "all" || item.category === filter);

  const accordionItems: AccordionGalleryItem[] = GALLERY_ITEMS.map((item) => ({
    id: item.id,
    image: item.imageUrl,
    label: item.title,
    sublabel: item.subtitle,
    category: item.category.toUpperCase(),
  }));

  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {/* Harmonized Header */}
      <SectionReveal className="max-w-3xl space-y-4">
        <div>
          <Badge variant="volt" className="font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            FACILITY ARCHITECTURE
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight font-heading leading-[1.08]">
          THE IRONX SANCTUARY IN PICTURES.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
          35,000 square feet of acoustically insulated, temperature-controlled athletic engineering.
        </p>
      </SectionReveal>

      {/* React Bits: Interactive Accordion Gallery Reel */}
      <SectionReveal delay={0.03} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dfff00] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#dfff00] font-bold">
              INTERACTIVE ARCHITECTURAL REEL
            </span>
          </div>
          <span className="text-xs text-[#71717a] font-mono hidden sm:inline">
            Hover panels to expand facility zones
          </span>
        </div>
        <AccordionGallery items={accordionItems} height="clamp(340px, 48vh, 500px)" />
      </SectionReveal>

      {/* Harmonized Filter Tabs */}
      <SectionReveal delay={0.05}>
        <div className="p-1.5 sm:p-2 rounded-2xl bg-[#0c0c10] border border-[#1f1f26] inline-flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none" role="tablist" aria-label="Facility Zones">
          {(["all", "iron", "recovery", "combat", "turf"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={`h-10 px-4 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer min-h-[40px] flex items-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] ${
                filter === tab
                  ? "bg-[#dfff00] text-[#08080a] shadow-sm font-extrabold"
                  : "bg-[#121217] border border-[#1f1f26] text-[#a1a1aa] hover:text-white hover:border-[#2e2e38]"
              }`}
            >
              {tab === "all" ? "All Zones" : tab}
            </button>
          ))}
        </div>
      </SectionReveal>

      {/* Responsive Gallery Grid */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-[#1f1f26] bg-[#121217] h-72 sm:h-80 transition-all duration-300 hover:border-[#2e2e38]"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-transparent" />
              <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6">
                <Badge variant="volt" className="mb-2 uppercase text-[10px] font-mono">
                  {item.category}
                </Badge>
                <h3 className="text-lg font-bold text-white uppercase font-heading group-hover:text-[#dfff00] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>
    </div>
  );
}
