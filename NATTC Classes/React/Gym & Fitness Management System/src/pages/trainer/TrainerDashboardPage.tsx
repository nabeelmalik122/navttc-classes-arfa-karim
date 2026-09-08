import React from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, Dumbbell, Clock, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useAuthStore } from "@/store/useAuthStore";
import { useGymStore } from "@/store/useGymStore";

export default function TrainerDashboardPage() {
  const { user } = useAuthStore();
  const classes = useGymStore((s) => s.classes);

  // DATA MODEL LIMITATION: Admin class creation currently hardcodes trainerId: 'trn_001' 
  // and uses free-text trainerName. We implement the safest scoped behavior possible 
  // by checking UID first, then exact displayName match as a fallback.
  const assignedClasses = classes.filter((c) => 
    c.trainerId === user?.uid || 
    (user?.displayName && c.trainerName === user.displayName)
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <SectionReveal>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="text-[10px] font-mono tracking-wider">FACULTY ROSTER: ACTIVE</Badge>
              <span className="text-xs font-mono text-[#71717a]">COACH ID: {user?.uid.slice(0, 10)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight">
              Coach Console: {user?.displayName || "Alex Thorne"}
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              Director of High Performance • 35 Weekly Allocated Floor Hours
            </p>
          </div>

          <div className="z-10 w-full md:w-auto">
            <Link to="/trainer/workouts" className="block w-full md:w-auto">
              <Button variant="volt" className="w-full md:w-auto min-h-[44px] gap-2">
                <Dumbbell className="w-4 h-4" aria-hidden="true" /> Create Workout Protocol
              </Button>
            </Link>
          </div>
        </div>
      </SectionReveal>

      {/* Trainer Metrics */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Assigned Classes</span>
              <Calendar className="w-4 h-4 text-amber-400" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">{assignedClasses.length}</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">Real-time live data</p>
          </Card>

          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Roster Athletes</span>
              <Users className="w-4 h-4 text-[#71717a]" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">142</p>
            <p className="text-[11px] text-[#71717a] mt-1 font-mono">Operational Demo Data</p>
          </Card>

          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Coach Rating</span>
              <Award className="w-4 h-4 text-[#71717a]" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">4.98 <span className="text-sm text-[#71717a]">/ 5.0</span></p>
            <p className="text-[11px] text-[#71717a] mt-1 font-mono">Operational Demo Data</p>
          </Card>

          <Card className="p-5 border-[#1f1f26] bg-[#121217] hover:border-[#2e2e38] transition-colors relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">Weekly Floor</span>
              <Clock className="w-4 h-4 text-[#71717a]" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">35 hrs</p>
            <p className="text-[11px] text-[#71717a] mt-1 font-mono">Operational Demo Data</p>
          </Card>
        </div>
      </SectionReveal>

      {/* Today's Agenda */}
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white uppercase font-heading">
              Today's Assigned Arena Sessions
            </h3>
            <Link to="/trainer/classes" className="text-xs text-amber-400 hover:underline font-mono">
              Manage Class Rosters →
            </Link>
          </div>

          <div className="divide-y divide-[#1f1f26]">
            {assignedClasses.length === 0 ? (
              <p className="py-4 text-sm text-[#a1a1aa] font-mono">No active arena sessions assigned to your roster today.</p>
            ) : (
              assignedClasses.map((cls) => (
                <div key={cls.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold">{cls.startTime} • {cls.room}</span>
                    <h4 className="text-lg font-bold text-white uppercase mt-0.5 font-heading">{cls.title}</h4>
                    <p className="text-xs text-[#a1a1aa] mt-1 font-mono">{cls.bookedCount} / {cls.capacity} Athletes Registered</p>
                  </div>

                  <Link to="/trainer/classes">
                    <Button variant="secondary" size="sm" className="min-h-[40px] gap-1.5">
                      View Attendee Roster <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
