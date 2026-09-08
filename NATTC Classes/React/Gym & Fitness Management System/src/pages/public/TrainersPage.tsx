import React, { useState } from "react";
import { Star, ShieldCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Modal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";
import { MOCK_TRAINERS } from "@/services/mockData";
import { DepthCarousel, type CarouselItem } from "@/components/reactbits";
import type { Trainer } from "@/types";

export default function TrainersPage() {
  const storeTrainers = useGymStore((s) => s.trainers);
  const trainers = (storeTrainers && storeTrainers.length >= 3) ? storeTrainers : MOCK_TRAINERS;
  const [activeTrainer, setActiveTrainer] = useState<Trainer | null>(null);

  const carouselItems: CarouselItem[] = trainers.map((trainer) => ({
    id: trainer.id,
    content: (
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#272736] bg-[#0c0c10] flex flex-col justify-end p-6 select-none group shadow-2xl">
        <img
          src={trainer.avatarUrl}
          alt={trainer.fullName}
          className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/65 to-transparent" />
        <div className="relative z-10 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <Badge variant="volt" className="font-mono text-xs inline-flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#08080a] text-[#08080a]" /> {trainer.rating}
            </Badge>
            <span className="text-[11px] font-mono text-[#a1a1aa] uppercase">{trainer.experienceYears} Yrs Exp</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight">{trainer.fullName}</h3>
          <p className="text-xs text-[#dfff00] font-mono uppercase tracking-wider">{trainer.title}</p>
          <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">{trainer.bio}</p>
          <Button
            variant="volt"
            size="sm"
            className="w-full mt-2 gap-1.5"
            onClick={() => setActiveTrainer(trainer)}
          >
            <span>View Faculty Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    ),
  }));

  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* Harmonized Header */}
      <SectionReveal className="max-w-3xl space-y-4">
        <div>
          <Badge variant="volt" className="font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            MASTER COACHING DIRECTORY
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight font-heading leading-[1.08]">
          THE APEX OF ATHLETIC PEDAGOGY.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
          Every IRONX coach is an active or former national athlete, holding premier CSCS, USAW, and Doctor of Physical Therapy credentials.
        </p>
        <p className="text-[#71717a] text-xs font-mono uppercase mt-4">
          * Currently displaying operational demo faculty profiles
        </p>
      </SectionReveal>

      {/* React Bits: 3D Depth Faculty Spotlight */}
      <SectionReveal delay={0.05} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dfff00] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#dfff00] font-bold">
              3D FACULTY SPOTLIGHT
            </span>
          </div>
          <span className="text-xs text-[#71717a] font-mono hidden sm:inline">
            Swipe or click controls to inspect
          </span>
        </div>
        <DepthCarousel items={carouselItems} autoPlay={true} autoPlayInterval={5000} />
      </SectionReveal>

      {/* Trainer Roster Grid */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="rounded-2xl border border-[#1f1f26] bg-[#121217] overflow-hidden flex flex-col sm:flex-row hover:border-[#2e2e38] transition-all duration-300 group"
            >
              <div className="sm:w-2/5 relative min-h-[260px] overflow-hidden bg-[#08080a]">
                <img
                  src={trainer.avatarUrl}
                  alt={trainer.fullName}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#121217] via-transparent to-transparent" />
              </div>

              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="volt" className="font-mono text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#dfff00] text-[#dfff00]" aria-hidden="true" /> {trainer.rating} ({trainer.totalReviews})
                    </Badge>
                    <span className="text-xs text-[#71717a] font-mono">{trainer.experienceYears} YRS EXP</span>
                  </div>

                  <h3 className="text-xl font-bold text-white uppercase font-heading group-hover:text-[#dfff00] transition-colors">
                    {trainer.fullName}
                  </h3>
                  <p className="text-xs text-[#dfff00] font-mono uppercase font-semibold">
                    {trainer.title}
                  </p>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-3">
                    {trainer.bio}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#1f1f26]">
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialties.map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#0c0c10] border border-[#1f1f26] text-[10px] text-[#a1a1aa] font-mono">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full min-h-[42px] gap-1.5"
                    onClick={() => setActiveTrainer(trainer)}
                  >
                    View Credentials & Bio <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Trainer Bio Modal */}
      {activeTrainer && (
        <Dialog open={!!activeTrainer} onOpenChange={() => setActiveTrainer(null)}>
          <DialogContent className="max-w-xl bg-[#0c0c10] border-[#1f1f26] text-[#f4f4f5]">
            <DialogHeader>
              <DialogTitle className="text-white uppercase font-heading text-xl">{activeTrainer.fullName}</DialogTitle>
              <DialogDescription className="text-[#dfff00] font-mono text-xs">
                {activeTrainer.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm text-[#f4f4f5]">
              <p className="leading-relaxed text-[#a1a1aa] text-sm">{activeTrainer.bio}</p>

              <div>
                <p className="text-xs font-mono text-[#71717a] uppercase tracking-wider mb-2">
                  Accreditations & Certifications:
                </p>
                <ul className="space-y-1.5">
                  {activeTrainer.certifications.map((cert, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#f4f4f5]">
                      <ShieldCheck className="w-4 h-4 text-[#dfff00] shrink-0" aria-hidden="true" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
