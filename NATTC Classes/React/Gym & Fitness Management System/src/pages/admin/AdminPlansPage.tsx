import { DollarSign, Check, Plus, Edit3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";

export default function AdminPlansPage() {
  const plans = useGymStore((s) => s.plans);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">COMMERCE & PRICING ARCHITECTURE</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Membership Plan Architecture
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Configure subscription tiers, price points, billing cadence, and enrolled facility privileges.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5 self-start sm:self-auto">
            <Button
              variant="secondary"
              disabled
              title="Plan creation is not connected yet."
              className="gap-2 min-h-[44px] font-bold opacity-50 cursor-not-allowed bg-[#121217] border-[#1f1f26] text-[#71717a]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Create Plan Tier
            </Button>
            <span className="text-[10px] font-mono text-[#71717a]">
              Plan creation is not connected yet.
            </span>
          </div>
        </div>
      </SectionReveal>

      {/* Commerce Telemetry Strip */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Configured Tiers</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">{plans.length} Tiers</div>
            <p className="text-[10px] text-[#71717a] font-mono">Active in catalog</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Baseline Admission</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">$79.00 / mo</div>
            <p className="text-[10px] text-[#71717a] font-mono">Foundation tier price</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] col-span-2 sm:col-span-1 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">All-Access Peak Tier</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">$249.00 / mo</div>
            <p className="text-[10px] text-[#71717a] font-mono">Titan executive membership</p>
          </div>
        </div>
      </SectionReveal>

      {/* Plan Architecture Grid */}
      <SectionReveal delay={0.1}>
        {plans.length === 0 ? (
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
              <DollarSign className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white uppercase font-heading">No Membership Plans</h2>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                No active membership tiers have been published to the catalog.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch pt-6 perspective-[1200px]">
            {plans.map((p) => {
              const isFeatured = p.isFeatured;
              const isTitan = p.tier === "titan-all-access";

              return (
                <div
                  key={p.id}
                  className={`group relative rounded-[28px] p-7 sm:p-9 flex flex-col justify-between space-y-6 transform-gpu transition-all duration-500 ease-out hover:-translate-y-3 cursor-default ${
                    isFeatured
                      ? "lg:-translate-y-2 bg-gradient-to-b from-[#181822] via-[#101017] to-[#07070a] border-2 border-[#dfff00] shadow-[0_15px_40px_rgba(223,255,0,0.15),0_0_60px_rgba(223,255,0,0.1)] hover:shadow-[0_30px_70px_rgba(223,255,0,0.3),0_0_80px_rgba(223,255,0,0.2)]"
                      : isTitan
                      ? "bg-gradient-to-b from-[#14141e] via-[#0c0c12] to-[#070709] border border-[#272736] hover:border-[#4d4d68] shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,255,255,0.06)]"
                      : "bg-gradient-to-b from-[#121218] via-[#0b0b10] to-[#070709] border border-[#1f1f29] hover:border-[#38384a] shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(223,255,0,0.06)]"
                  }`}
                >
                  {/* 3D Specular Radial Top Glow */}
                  <div
                    className={`absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-500 ${
                      isFeatured
                        ? "bg-[radial-gradient(ellipse_at_top,_rgba(223,255,0,0.12),_transparent_70%)] opacity-100"
                        : "bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_70%)] opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {/* Most Popular Floating Pill Ribbon on Featured Card */}
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#dfff00] text-[#08080a] text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-black uppercase font-mono tracking-wider sm:tracking-widest px-3 sm:px-5 py-1.5 rounded-full shadow-[0_0_25px_rgba(223,255,0,0.7)] flex items-center gap-1.5 z-20 whitespace-nowrap border-2 border-[#08080a] max-w-[92%] justify-center">
                      <Sparkles className="w-3.5 h-3.5 fill-[#08080a]" aria-hidden="true" />
                      <span className="truncate">RECOMMENDED ATHLETE TIER</span>
                    </div>
                  )}

                  <div className="space-y-6 z-10">
                    {/* Header Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-2 min-h-[30px]">
                      <span className="text-[10px] font-mono uppercase tracking-wider sm:tracking-widest px-2.5 sm:px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-bold group-hover:border-[#dfff00]/40 transition-colors shadow-inner truncate">
                        TIER 0{p.tier === "starter" ? "1" : isFeatured ? "2" : "3"} / {p.tier === "starter" ? "FOUNDATION" : isFeatured ? "PRO ATHLETE" : "ALL-ACCESS"}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2.5 sm:px-3 py-0.5 rounded-full shrink-0">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                        {p.status}
                      </span>
                    </div>

                    {/* Plan Name & Tagline */}
                    <div>
                      <h2 className="text-2xl min-[360px]:text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight transition-colors duration-300 group-hover:text-[#dfff00] break-words">
                        {p.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 leading-relaxed min-h-[40px]">
                        {p.tagline}
                      </p>
                    </div>

                    {/* 3D Recessed Pricing Chamber */}
                    <div className="bg-[#060609]/95 rounded-2xl p-5 border border-[#1b1b24] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] group-hover:border-[#2a2a38] transition-colors flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#dfff00] font-mono">$</span>
                        <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                          {p.priceMonthly}
                        </span>
                        <span className="text-xs text-[#71717a] font-mono font-medium ml-1">/ month</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#121218] border border-[#20202c]">
                        Monthly
                      </span>
                    </div>

                    {/* Privileges Feature List with 3D Glowing Checkmarks */}
                    <div className="space-y-3.5 pt-2">
                      <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest block font-bold">
                        Enrolled Privileges ({p.features.length})
                      </span>
                      <ul className="space-y-3 text-xs sm:text-sm text-[#f4f4f5]">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 group/item">
                            <div className="w-5 h-5 rounded-full bg-[#dfff00]/10 border border-[#dfff00]/30 flex items-center justify-center text-[#dfff00] shrink-0 mt-0.5 group-hover:bg-[#dfff00] group-hover:text-[#08080a] transition-all duration-300 shadow-[0_0_8px_rgba(223,255,0,0.15)] group-hover:shadow-[0_0_12px_rgba(223,255,0,0.6)]">
                              <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                            </div>
                            <span className="text-xs sm:text-sm leading-relaxed text-[#d4d4d8] group-hover/item:text-white transition-colors">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3D Action Controls */}
                  <div className="pt-7 mt-7 border-t border-[#1b1b24] z-10">
                    <Button
                      variant="secondary"
                      size="lg"
                      disabled
                      title="Tier parameter editing is not connected yet."
                      className="w-full gap-2 min-h-[52px] text-sm font-black uppercase tracking-wider rounded-2xl opacity-50 cursor-not-allowed bg-[#111117] border-[#22222f] text-[#71717a]"
                    >
                      <Edit3 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Edit Tier Parameters</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionReveal>
    </div>
  );
}
