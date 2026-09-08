import React from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Flame, Zap, RefreshCw, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";

const PROGRAMS = [
  {
    id: "prog_01",
    title: "APEX Hypertrophy Protocol",
    category: "Strength & Mass",
    duration: "12 Weeks",
    frequency: "4-5 Days / Week",
    description: "Periodized volume progression with mechanical drop-sets, loaded stretches, and strict tempo controls to stimulate maximum myofibrillar hypertrophy.",
    icon: Dumbbell,
    perks: ["Compound & Isolation Balance", "Target RPE Load Scaling", "Weekly Volume Analytics", "1-on-1 Form Audits"],
    intensity: "Advanced"
  },
  {
    id: "prog_02",
    title: "IronX Combat Conditioning",
    category: "Metabolic & Agility",
    duration: "8 Weeks",
    frequency: "3-4 Days / Week",
    description: "Striking mechanics, explosive rotational power, and oxygen-depletion interval drills designed to forge relentless aerobic and anaerobic stamina.",
    icon: Flame,
    perks: ["Heavy Bag Combinations", "Footwork Speed Ladders", "Assault Bike Intervals", "Core Torque Workouts"],
    intensity: "Intermediate - Elite"
  },
  {
    id: "prog_03",
    title: "Olympic Barbell Kinematics",
    category: "Technical Power",
    duration: "16 Weeks",
    frequency: "3 Days / Week",
    description: "Mastery of the Snatch, Clean & Jerk, and foundational pulls with high-speed video trajectory analysis and barbell velocity telemetry.",
    icon: Zap,
    perks: ["Video Trajectory Review", "Eleiko Competition Bars", "Mobility Prerequisite Drills", "Progressive Max Peaking"],
    intensity: "All Levels to Elite"
  },
  {
    id: "prog_04",
    title: "Neuro-Mobility & Active Decompression",
    category: "Longevity & Health",
    duration: "Ongoing",
    frequency: "2-3 Days / Week",
    description: "Joint capsule expansion, spine decompression, and neuromuscular restorative movement designed to eliminate chronic tightness and prevent injury.",
    icon: RefreshCw,
    perks: ["Controlled Articular Rotations", "Myofascial Release", "Spine Decompression", "Contrast Sauna Integration"],
    intensity: "All Levels"
  }
];

export default function ProgramsPage() {
  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* Harmonized Header */}
      <SectionReveal className="max-w-3xl space-y-4">
        <div>
          <Badge variant="volt" className="font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            SCIENTIFIC PERIODIZATION
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight font-heading leading-[1.08]">
          ATHLETIC PROGRAMS FORGED FOR MEASURABLE RESULTS.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
          Structured, periodized training protocols authored by our master coaches. Track your sets, reps, and PR progression directly in your member portal.
        </p>
      </SectionReveal>

      {/* Program Grid */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PROGRAMS.map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 flex flex-col justify-between hover:border-[#2e2e38] transition-all duration-300 space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center text-[#dfff00] group-hover:border-[#2e2e38] transition-colors">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <Badge variant="default" className="font-mono text-xs">{prog.duration}</Badge>
                      <Badge variant="volt" className="text-xs">{prog.intensity}</Badge>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-[#dfff00] font-mono uppercase tracking-wider">{prog.category}</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white uppercase mt-1 font-heading group-hover:text-[#dfff00] transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-[#a1a1aa] mt-2 leading-relaxed">{prog.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[#1f1f26]">
                    <p className="text-xs font-mono text-[#71717a] uppercase tracking-wider mb-3">Protocol Deliverables:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#f4f4f5]">
                      {prog.perks.map((perk, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#dfff00] shrink-0" aria-hidden="true" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#1f1f26] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-[#71717a] font-mono">{prog.frequency}</span>
                  <Link to="/pricing" className="w-full sm:w-auto">
                    <Button variant="volt" size="sm" className="w-full sm:w-auto min-h-[40px] gap-1.5">
                      Enroll in Program <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </SectionReveal>
    </div>
  );
}
