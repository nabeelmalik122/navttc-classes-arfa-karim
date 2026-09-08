import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Dumbbell,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useAuthStore } from "@/store/useAuthStore";
import { useGymStore } from "@/store/useGymStore";

export default function MemberDashboardPage() {
  const { user } = useAuthStore();
  const bookings = useGymStore((s) => s.bookings);
  const workouts = useGymStore((s) => s.workouts);
  const progress = useGymStore((s) => s.progress);

  const userBookings = bookings.filter((b) => b.userId === user?.uid && b.status === "confirmed");
  const nextBooking = userBookings[0];
  const activeWorkout = workouts[0];
  const latestProgress = progress[progress.length - 1];

  const subscription = user?.subscription;
  const accessPolicy = user?.accessPolicy;
  const planKey = subscription?.planId
    ? subscription.planId.replace("plan_", "")
    : accessPolicy?.planId
    ? accessPolicy.planId.replace("plan_", "")
    : null;

  const activePlanName = planKey === "foundation"
    ? "Foundation"
    : planKey === "pro"
    ? "Pro Athlete"
    : planKey === "titan_all_access" || planKey === "titan"
    ? "Titan All-Access"
    : accessPolicy?.accessState === "active"
    ? "Active Standing"
    : "No Active Plan";

  const renewalStatusText = subscription?.currentBillingPeriodEnd
    ? `Renews ${new Date(subscription.currentBillingPeriodEnd).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
    : accessPolicy?.accessState === "active"
    ? "Active Access Policy"
    : "Unenrolled Plan";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome & Streak Banner */}
      <SectionReveal>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <Badge variant="volt" className="text-[10px] font-mono tracking-wider">ATHLETE STATUS: ACTIVE</Badge>
              <span className="text-xs font-mono text-[#71717a]">ID: {user?.uid.slice(0, 10)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight break-words">
              Welcome back, {user?.displayName || "Athlete"}.
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              Current Protocol Focus: <span className="text-[#f4f4f5] font-semibold">{user?.metadata?.fitnessGoal || "Athletic Conditioning"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 z-10 w-full md:w-auto">
            <div className="bg-[#121217] border border-[#1f1f26] rounded-xl p-3.5 sm:p-4 text-center flex-1 md:min-w-[110px]">
              <div className="flex items-center justify-center gap-1 text-[#dfff00] font-bold text-2xl font-mono">
                <Flame className="w-5 h-5 fill-[#dfff00]" aria-hidden="true" /> 14
              </div>
              <p className="text-[10px] font-mono text-[#71717a] uppercase mt-1">Day Streak</p>
            </div>

            <div className="bg-[#121217] border border-[#1f1f26] rounded-xl p-3.5 sm:p-4 text-center flex-1 md:min-w-[110px]">
              <div className="text-2xl font-bold text-white font-mono">
                {latestProgress?.weightKg ? latestProgress.weightKg : "--"} <span className="text-xs text-[#71717a]">kg</span>
              </div>
              <p className="text-[10px] font-mono text-[#71717a] uppercase mt-1">Bodyweight</p>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Primary KPI Telemetry Widgets */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Class Reservations</span>
              <Calendar className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">{userBookings.length}</p>
            <p className="text-[11px] text-[#71717a] mt-1 font-mono">Upcoming sessions scheduled</p>
          </Card>

          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Assigned Workouts</span>
              <Dumbbell className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">{workouts.length}</p>
            <p className="text-[11px] text-[#71717a] mt-1 font-mono">Active training templates</p>
          </Card>

          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Bench 1RM PR</span>
              <TrendingUp className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
              {latestProgress?.benchPressMaxKg ? latestProgress.benchPressMaxKg : "--"} <span className="text-xs text-[#71717a]">kg</span>
            </p>
            <p className="text-[11px] text-[#71717a] mt-1 font-mono">
              {latestProgress?.benchPressMaxKg ? "Latest verified PR" : "No entry recorded"}
            </p>
          </Card>

          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Active Tier</span>
              <Award className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
            </div>
            <p className="text-xl font-bold text-white uppercase mt-2 font-heading">{activePlanName}</p>
            <p className="text-[11px] text-[#71717a] mt-1 font-mono">{renewalStatusText}</p>
          </Card>
        </div>
      </SectionReveal>

      {/* Main Split: Next Booking vs Workout Protocol */}
      <SectionReveal delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Next Session Widget */}
          <div className="lg:col-span-6 rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="volt" className="text-[10px] font-mono">NEXT ARENA RESERVATION</Badge>
                <Link to="/member/bookings" className="text-xs text-[#dfff00] hover:underline font-mono">
                  View Ledger →
                </Link>
              </div>

              {nextBooking ? (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading">
                    {nextBooking.className}
                  </h3>
                  <div className="space-y-2 text-xs text-[#f4f4f5] font-mono">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#dfff00] shrink-0" aria-hidden="true" />
                      <span>Date: {nextBooking.bookingDate} at {nextBooking.startTime}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#dfff00] shrink-0" aria-hidden="true" />
                      <span>Room: {nextBooking.room}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#dfff00] shrink-0" aria-hidden="true" />
                      <span>Coach: {nextBooking.trainerName}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-[#71717a] text-xs font-mono">
                  No active bookings. Check the schedule to reserve a class spot.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1f1f26]">
              <Link to="/classes" className="block w-full">
                <Button variant="outline" className="w-full min-h-[44px] gap-2">
                  <Calendar className="w-4 h-4" aria-hidden="true" /> Book Additional Class
                </Button>
              </Link>
            </div>
          </div>

          {/* Workout Routine Preview */}
          <div className="lg:col-span-6 rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="default" className="text-[10px] font-mono">ASSIGNED PROTOCOL</Badge>
                <Link to="/member/workouts" className="text-xs text-[#dfff00] hover:underline font-mono">
                  Log Sets →
                </Link>
              </div>

              {activeWorkout ? (
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading">
                    {activeWorkout.title}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                    {activeWorkout.description}
                  </p>
                  <div className="pt-2 space-y-1.5">
                    {activeWorkout.exercises.slice(0, 3).map((ex, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#0c0c10] border border-[#1f1f26]">
                        <span className="text-[#f4f4f5] font-medium">{ex.name}</span>
                        <span className="text-[#dfff00] font-mono font-semibold">{ex.sets} × {ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#71717a] font-mono py-8 text-center">No workout assigned yet.</p>
              )}
            </div>

            <div className="pt-4 border-t border-[#1f1f26]">
              <Link to="/member/workouts" className="block w-full">
                <Button variant="volt" className="w-full min-h-[44px] gap-2">
                  <Dumbbell className="w-4 h-4" aria-hidden="true" /> Launch Workout Tracker
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
