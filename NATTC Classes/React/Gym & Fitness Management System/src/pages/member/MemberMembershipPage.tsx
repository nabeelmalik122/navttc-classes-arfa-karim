import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Check, ArrowRight, ShieldCheck, UserCheck, AlertTriangle, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useAuthStore } from "@/store/useAuthStore";
import { PADDLE_SANDBOX_CATALOG } from "@/services/paddle/paddle.config";

export default function MemberMembershipPage() {
  const { user } = useAuthStore();
  const subscription = user?.subscription;
  const accessPolicy = user?.accessPolicy;

  // Resolve active plan from server-authoritative access policy / subscription
  const planKey = subscription?.planId
    ? subscription.planId.replace("plan_", "")
    : accessPolicy?.planId
    ? accessPolicy.planId.replace("plan_", "")
    : null;

  const currentPlan = planKey
    ? (PADDLE_SANDBOX_CATALOG[planKey === "titan_all_access" ? "titan" : planKey] || null)
    : null;

  const isSubscribed = Boolean(subscription && currentPlan && accessPolicy?.accessState !== "none");
  const accessState = accessPolicy?.accessState || "none";

  // Format renewal or expiration date
  const formattedPeriodEnd = subscription?.currentBillingPeriodEnd
    ? new Date(subscription.currentBillingPeriodEnd).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const formattedGraceExpiry = accessPolicy?.effectiveUntil && accessState === "grace"
    ? new Date(accessPolicy.effectiveUntil).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">SUBSCRIPTION & ACCESS</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Membership Command
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Authoritative subscription status, facility privileges, and billing telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {accessState === "active" && (
              <Badge variant="success" className="text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" /> ACTIVE STANDING
              </Badge>
            )}
            {accessState === "grace" && (
              <Badge variant="warning" className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border-amber-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" /> 72H GRACE PERIOD
              </Badge>
            )}
            {accessState === "restricted" && (
              <Badge variant="destructive" className="text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5" /> ACCESS RESTRICTED
              </Badge>
            )}
            {accessState === "canceled" && (
              <Badge variant="outline" className="text-[10px] font-mono text-zinc-400 border-zinc-700">
                CANCELED
              </Badge>
            )}
            {accessState === "none" && (
              <Badge variant="outline" className="text-[10px] font-mono text-[#71717a] border-[#272730]">
                UNENROLLED
              </Badge>
            )}
          </div>
        </div>
      </SectionReveal>

      {/* Grace Period Alert Banner if Active */}
      {accessState === "grace" && (
        <SectionReveal delay={0.02}>
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 sm:p-5 flex items-start gap-3.5 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold font-mono uppercase tracking-wider block text-amber-300">
                Action Required: Payment Renewal Pending
              </span>
              <p className="text-amber-200/90 leading-relaxed">
                Your latest subscription payment did not clear. A 72-hour grace period is active until{" "}
                <span className="font-bold text-amber-100">{formattedGraceExpiry || "72 hours"}</span>. Please verify your payment details to retain uninterrupted facility access.
              </p>
            </div>
          </div>
        </SectionReveal>
      )}

      {/* Primary Tier Card (Subscribed vs Unenrolled) */}
      <SectionReveal delay={0.05}>
        {isSubscribed && currentPlan ? (
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f26]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#dfff00] font-mono uppercase tracking-wider">
                    {currentPlan.tierNumber}
                  </span>
                  <span className="text-xs text-[#71717a] font-mono">• ATHLETE ID: {user?.uid.slice(0, 8)}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading">
                  {currentPlan.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#a1a1aa]">{currentPlan.tagline}</p>
              </div>

              <div className="sm:text-right bg-[#121217] sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none border border-[#1f1f26] sm:border-0">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  ${currentPlan.baseAmountUsd} <span className="text-xs text-[#71717a] font-sans font-normal">/ month</span>
                </div>
                <div className="text-[11px] text-[#a1a1aa] font-mono mt-1 flex items-center sm:justify-end gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                  <span>Enrolled Plan</span>
                </div>
              </div>
            </div>

            {/* Member Privileges & Included Features */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">
                Enrolled Facility Privileges ({currentPlan.features.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#f4f4f5]">
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#121217] border border-[#1f1f26]">
                    <Check className="w-4 h-4 text-[#dfff00] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-6 border-t border-[#1f1f26] flex flex-wrap items-center gap-3">
              <Link to="/pricing">
                <Button variant="volt" className="min-h-[44px] gap-2 font-bold">
                  Change Membership Tier <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#a1a1aa]">
                  <Sparkles className="w-3.5 h-3.5 text-[#dfff00]" />
                  <span>NO ACTIVE SUBSCRIPTION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading">
                  Unlock Uncompromising Facility Access
                </h2>
                <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                  You are currently not enrolled in an active IRONX membership tier. Choose a plan to unlock 24/7 athletic gym floor access, master trainer scheduling, and recovery vaults.
                </p>
              </div>

              <div className="shrink-0">
                <Link to="/pricing">
                  <Button variant="volt" size="lg" className="gap-2 font-bold uppercase tracking-wider">
                    Browse Plans <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </SectionReveal>

      {/* Account Standing & Billing Telemetry Ledger */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Member Profile Standing */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold font-heading text-sm uppercase">
              <UserCheck className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              <span>Identity & Credential</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-[#1f1f26]">
                <span className="text-[#71717a]">Primary Member</span>
                <span className="text-white font-bold">{user?.displayName || "Athlete"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1f1f26]">
                <span className="text-[#71717a]">Associated Email</span>
                <span className="text-white">{user?.email || "member@ironx.fitness"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#71717a]">Authentication ID</span>
                <span className="text-[#a1a1aa] truncate max-w-[180px]">{user?.uid || "usr_member_001"}</span>
              </div>
            </div>
          </div>

          {/* Billing & Settlement */}
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold font-heading text-sm uppercase">
              <CreditCard className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              <span>Payment & Billing</span>
            </div>
            <div className="space-y-3 text-xs font-mono">
              {isSubscribed && subscription ? (
                <div className="p-3 rounded-lg bg-[#121217] border border-[#1f1f26] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Paddle Sandbox Billing</span>
                    <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      {subscription.status}
                    </span>
                  </div>
                  {formattedPeriodEnd && (
                    <div className="flex items-center gap-1.5 text-[#a1a1aa] text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#dfff00]" />
                      <span>Renews / Valid through: {formattedPeriodEnd}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#121217] border border-[#1f1f26] space-y-1">
                  <div className="text-white font-bold">No Active Billing Subscription</div>
                  <p className="text-[#71717a] text-[11px] leading-relaxed">
                    Online recurring subscriptions will be recorded here via verified Paddle webhooks.
                  </p>
                </div>
              )}
              <div className="flex justify-between py-1 text-[#71717a]">
                <span>Billing Provider</span>
                <span className="text-[#a1a1aa]">Paddle Sandbox (MoR)</span>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
