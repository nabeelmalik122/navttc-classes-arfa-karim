import React from "react";
import { Check, ShieldCheck, Zap, ArrowRight, HelpCircle, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { IRONX_TIERS } from "@/services/paddle/paddle.config";
import { usePaddle } from "@/services/paddle/usePaddle";

export default function PricingPage() {
  const {
    isConfigured,
    isLoadingPrices,
    priceMap,
    priceError,
    activeCheckoutTierId,
    handleSubscribe,
  } = usePaddle();

  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* Harmonized Header */}
      <SectionReveal className="text-center max-w-3xl mx-auto space-y-4">
        <div>
          <Badge variant="volt" className="font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            TRANSPARENT MEMBERSHIPS
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight font-heading leading-[1.08]">
          INVEST IN UNCOMPROMISING PHYSICAL CAPACITY.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
          Monthly recurring access with zero initiation fees, zero cancellation penalties, and seamless digital concierge integration.
        </p>

        {/* Sandbox Configuration Notice if Token is not configured */}
        {!isConfigured && (
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Paddle Sandbox Mode: Provide <code className="font-bold">VITE_PADDLE_CLIENT_TOKEN</code> in <code className="font-bold">.env.local</code> to activate checkout overlay.</span>
            </div>
          </div>
        )}

        {/* Live Price Preview Notice if preview returned error */}
        {priceError && isConfigured && (
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{priceError} Displaying USD base catalog rates.</span>
            </div>
          </div>
        )}
      </SectionReveal>

      {/* Pricing Cards Grid - Equal Heights & Baseline Aligned */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch pt-4 sm:pt-6 perspective-[1200px]">
          {IRONX_TIERS.map((plan) => {
            const isFeatured = plan.isFeatured;
            const isTitan = plan.isTitan;
            const isOpening = activeCheckoutTierId === plan.id;
            const preview = priceMap[plan.priceId];

            return (
              <div
                key={plan.id}
                className={`group relative rounded-[28px] p-7 sm:p-9 flex flex-col justify-between h-full transform-gpu transition-all duration-500 ease-out hover:-translate-y-3 cursor-default ${
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

                {/* Floating 3D Badge on Featured Card */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#dfff00] text-[#08080a] text-[10px] sm:text-[11px] font-black uppercase font-mono tracking-wider sm:tracking-widest px-3.5 sm:px-5 py-1.5 rounded-full shadow-[0_0_25px_rgba(223,255,0,0.7)] flex items-center gap-1.5 z-30 whitespace-nowrap border-2 border-[#08080a]">
                    <Sparkles className="w-3.5 h-3.5 fill-[#08080a] shrink-0" aria-hidden="true" />
                    <span>RECOMMENDED ATHLETE TIER</span>
                  </div>
                )}

                <div className="space-y-6 z-10">
                  {/* Top Tier Header Strip */}
                  <div className="flex items-center justify-between min-h-[30px]">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-bold group-hover:border-[#dfff00]/40 transition-colors shadow-inner">
                      {plan.tierNumber}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-3 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                      Live Roster
                    </span>
                  </div>

                  {/* Plan Name & Tagline */}
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black uppercase text-white font-heading tracking-tight transition-colors duration-300 group-hover:text-[#dfff00]">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 min-h-[40px] leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* 3D Recessed Price Vault */}
                  <div className="bg-[#060609]/95 rounded-2xl p-5 border border-[#1b1b24] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] group-hover:border-[#2a2a38] transition-colors flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      {isLoadingPrices && isConfigured ? (
                        <div className="flex items-center gap-2 py-1">
                          <Loader2 className="w-5 h-5 text-[#dfff00] animate-spin" />
                          <span className="text-xs font-mono text-[#71717a]">Loading live rate...</span>
                        </div>
                      ) : preview ? (
                        <>
                          <span className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
                            {preview.formattedTotal}
                          </span>
                          <span className="text-xs text-[#71717a] font-mono font-medium ml-1">
                            / month
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl sm:text-3xl font-black text-[#dfff00] font-mono">$</span>
                          <span className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight">
                            {plan.baseAmountUsd}
                          </span>
                          <span className="text-xs text-[#71717a] font-mono font-medium ml-1">
                            / month
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#121218] border border-[#20202c]">
                      Monthly
                    </span>
                  </div>

                  {/* Included Privileges with 3D Glowing Bead Icons */}
                  <div className="space-y-3.5 pt-2">
                    <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest block font-bold">
                      Enrolled Privileges ({plan.features.length})
                    </span>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#f4f4f5]">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 group/item">
                          <div className="w-5 h-5 rounded-full bg-[#dfff00]/10 border border-[#dfff00]/30 flex items-center justify-center text-[#dfff00] shrink-0 mt-0.5 group-hover:bg-[#dfff00] group-hover:text-[#08080a] transition-all duration-300 shadow-[0_0_8px_rgba(223,255,0,0.15)] group-hover:shadow-[0_0_12px_rgba(223,255,0,0.6)]">
                            <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                          </div>
                          <span className="text-xs sm:text-sm leading-relaxed text-[#d4d4d8] group-hover/item:text-white transition-colors">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tactile 3D Action Button */}
                <div className="pt-7 mt-7 border-t border-[#1b1b24] z-10">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isOpening}
                    variant={isFeatured ? "volt" : "secondary"}
                    className={`w-full gap-2 min-h-[52px] text-sm font-black uppercase tracking-wider rounded-2xl transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                      isFeatured
                        ? "bg-[#dfff00] text-[#08080a] hover:bg-[#eeff55] shadow-[0_6px_30px_rgba(223,255,0,0.4)] hover:shadow-[0_10px_45px_rgba(223,255,0,0.65)] hover:scale-[1.02]"
                        : "bg-[#111117] border-[#22222f] text-white hover:bg-[#181822] hover:border-[#dfff00] hover:text-[#dfff00] hover:shadow-[0_6px_25px_rgba(0,0,0,0.6)]"
                    }`}
                    size="lg"
                  >
                    {isOpening ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                        <span>Opening Checkout...</span>
                      </>
                    ) : (
                      <>
                        <span>Select {plan.name}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionReveal>

      {/* Trust & Guarantee Banner */}
      <SectionReveal delay={0.15}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a1a1aa]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#dfff00]" aria-hidden="true" /> 14-Day Performance Guarantee with Full Refund
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#dfff00]" aria-hidden="true" /> Instant Access to Digital Workout Suite
          </span>
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#dfff00]" aria-hidden="true" /> 24/7 Athlete Concierge Support
          </span>
        </div>
      </SectionReveal>
    </div>
  );
}
