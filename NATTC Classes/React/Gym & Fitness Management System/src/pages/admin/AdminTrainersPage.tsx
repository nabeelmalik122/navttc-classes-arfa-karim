import React from "react";
import { Award, Star, Plus, ShieldCheck, Mail, Phone, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";

export default function AdminTrainersPage() {
  const trainers = useGymStore((s) => s.trainers);

  const totalCerts = trainers.reduce((sum, t) => sum + (t.certifications?.length || 0), 0);
  const avgRating = (trainers.reduce((sum, t) => sum + t.rating, 0) / (trainers.length || 1)).toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">STAFF & COACHING OPERATIONS</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Master Coaches & Staff Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Manage head coaching faculty, verified certifications, and operational floor allocations.
            </p>
          </div>

          <Button
            variant="volt"
            onClick={() => notify.info({
              title: "COACH ONBOARDING",
              message: "Staff onboarding portal is scheduled for the next administrative release.",
            })}
            className="gap-2 min-h-[44px] font-bold self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Onboard New Coach
          </Button>
        </div>
      </SectionReveal>

      {/* Staff Telemetry Strip */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1 relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Active Coaching Staff</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white relative z-10">{trainers.length} Faculty</div>
            <p className="text-[10px] text-[#71717a] font-mono relative z-10">Operational Demo Data</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Average Staff Rating</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">★ {avgRating} / 5.0</div>
            <p className="text-[10px] text-[#71717a] font-mono">Member audit consensus</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] col-span-2 sm:col-span-1 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Accredited Credentials</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">{totalCerts} Total</div>
            <p className="text-[10px] text-[#71717a] font-mono">CSCS, USAW, NASM, FMS certified</p>
          </div>
        </div>
      </SectionReveal>

      {/* Staff Roster Grid */}
      <SectionReveal delay={0.1}>
        {trainers.length === 0 ? (
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
              <Award className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white uppercase font-heading">No Coaches On Roster</h2>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                No active coaching faculty has been registered in the system yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {trainers.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 flex flex-col justify-between space-y-5 hover:border-[#2e2e38] transition-colors"
              >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={t.avatarUrl}
                    alt={t.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-[#1f1f26] shrink-0 bg-[#121217]"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-white uppercase font-heading truncate">
                        {t.fullName}
                      </h2>
                      <Badge variant="volt" className="font-mono text-[10px]">
                        ★ {t.rating}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#dfff00] font-mono font-semibold">{t.title}</p>
                    <p className="text-xs text-[#71717a] font-mono">
                      {t.experienceYears} Years Exp • {t.totalReviews} Verified Reviews
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1f1f26] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                    Verified Certifications & Accreditations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.certifications.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#08080a] px-2.5 py-1 rounded-md border border-[#1f1f26] text-[#a1a1aa] font-mono"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1f1f26] flex items-center justify-between gap-3">
                <div className="text-xs font-mono text-[#71717a] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                  <span>{t.weeklyAvailableHours || 35}h / week</span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => notify.info({
                    title: "PERFORMANCE AUDIT",
                    message: `Displaying active credentials and roster statistics for ${t.fullName}.`,
                  })}
                  className="min-h-[40px] font-mono text-xs bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38]"
                >
                  Audit Performance
                </Button>
              </div>
            </div>
          ))}
        </div>
        )}
      </SectionReveal>
    </div>
  );
}
