import React from "react";
import { Link } from "react-router-dom";
import { Users, Target, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* Harmonized Header */}
      <SectionReveal className="max-w-3xl space-y-4">
        <div>
          <Badge variant="volt" className="font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            THE IRONX MANIFESTO
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight font-heading leading-[1.08]">
          BUILT FOR THOSE WHO DEMAND MORE FROM THEIR TRAINING.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
          Founded in 2021 by Olympic strength coaches and biomechanics researchers, IronX was conceived to dismantle generic commercial gym culture and restore uncompromised athletic rigor.
        </p>
      </SectionReveal>

      {/* Hero Image Banner */}
      <SectionReveal delay={0.05}>
        <div className="relative rounded-2xl overflow-hidden border border-[#1f1f26] h-[320px] sm:h-[420px] lg:h-[460px]">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
            alt="IronX Facility Main Floor"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-transparent" />
          <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 flex flex-wrap items-center justify-between text-white gap-4">
            <div>
              <p className="font-extrabold text-lg sm:text-xl uppercase font-heading">IRONX SANCTUARY I</p>
              <p className="text-xs text-[#a1a1aa] font-mono">Performance District • 35,000 SQ FT</p>
            </div>
            <Badge variant="volt" className="font-mono text-xs uppercase">FLAGSHIP HIGH-PERFORMANCE FACILITY</Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Core Principles */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 space-y-4 hover:border-[#2e2e38] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] group-hover:border-[#2e2e38] transition-colors">
              <Target className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase font-heading group-hover:text-[#dfff00] transition-colors">Biomechanical Precision</h3>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Every movement protocol is calibrated to leverage human skeletal geometry, minimize shear forces on joints, and maximize neuromuscular recruitment.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 space-y-4 hover:border-[#2e2e38] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] group-hover:border-[#2e2e38] transition-colors">
              <Award className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase font-heading group-hover:text-[#dfff00] transition-colors">Elite Hardware Standards</h3>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              We exclusively stock certified competition barbells from Eleiko, calibrated cast-iron plates, custom stainless steel dumbell sets, and custom-welded turf equipment.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 space-y-4 hover:border-[#2e2e38] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] group-hover:border-[#2e2e38] transition-colors">
              <Users className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase font-heading group-hover:text-[#dfff00] transition-colors">Disciplined Community</h3>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Our members range from competitive powerlifters to busy executives who treat their physical capacity as a non-negotiable pillar of their daily performance.
            </p>
          </div>
        </div>
      </SectionReveal>

      {/* Call to action */}
      <SectionReveal delay={0.15}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-heading">Ready to elevate your training standard?</h3>
            <p className="text-sm text-[#a1a1aa]">Book a 1-on-1 walkthrough with one of our master athletic coaches.</p>
          </div>
          <Link to="/contact" className="w-full sm:w-auto">
            <Button variant="volt" size="lg" className="w-full sm:w-auto min-h-[48px] gap-2 shrink-0">
              Book Facility Walkthrough <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </SectionReveal>
    </div>
  );
}
