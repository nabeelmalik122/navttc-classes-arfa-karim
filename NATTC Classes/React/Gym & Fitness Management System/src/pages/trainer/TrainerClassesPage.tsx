import React, { useState } from "react";
import { Calendar, Users, CheckCircle2, Clock, MapPin, Search, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useAuthStore } from "@/store/useAuthStore";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";

export default function TrainerClassesPage() {
  const { user } = useAuthStore();
  const allSystemClasses = useGymStore((s) => s.classes);
  const bookings = useGymStore((s) => s.bookings);
  const checkInBooking = useGymStore((s) => s.checkInBooking);
  
  // Scoped to authenticated trainer
  const classes = allSystemClasses.filter((c) => 
    c.trainerId === user?.uid || 
    (user?.displayName && c.trainerName === user.displayName)
  );

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || "cls_001");
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classBookings = bookings.filter((b) => b.classId === activeClass?.id);

  const handleMarkPresent = async (bookingId: string, name: string) => {
    setCheckingInId(bookingId);
    try {
      await checkInBooking(bookingId);
      notify.success({
        title: "CHECK-IN VERIFIED",
        message: `Verified: ${name} checked in to session.`,
      });
    } catch (err) {
      notify.error({
        title: "CHECK-IN FAILED",
        message: `Failed to check in ${name}.`,
      });
    } finally {
      setCheckingInId(null);
    }
  };

  const attendedCount = classBookings.filter((b) => b.status === "attended").length;

  if (classes.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <SectionReveal>
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">SESSION CONTROL</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Assigned Master Classes
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Review attendee sign-ins, audit arena capacity, and execute on-site check-ins.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
              <Calendar className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white uppercase font-heading">No Classes Allocated</h2>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                You do not have any active master classes assigned to your floor rotation at this time.
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">SESSION CONTROL</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Assigned Master Classes
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Review attendee sign-ins, audit arena capacity, and execute on-site check-ins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              {classes.length} MASTER SESSIONS ACTIVE
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Class Selector Bar */}
      <SectionReveal delay={0.05}>
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
            Select Coaching Session
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {classes.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClassId(cls.id)}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-xl border text-left min-w-[240px] max-w-[280px] transition-colors shrink-0 ${
                    isSelected
                      ? "border-[#dfff00] bg-[#16161b] text-white"
                      : "border-[#1f1f26] bg-[#0c0c10] text-[#a1a1aa] hover:border-[#2e2e38]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-bold ${isSelected ? "text-[#dfff00]" : "text-white"}`}>
                      {cls.startTime}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#71717a]">
                      {cls.room}
                    </span>
                  </div>
                  <h2 className="font-bold text-sm text-white uppercase truncate mt-1.5 font-heading">
                    {cls.title}
                  </h2>
                  <div className="flex items-center justify-between text-xs text-[#71717a] font-mono mt-2 pt-2 border-t border-[#1f1f26]">
                    <span>Capacity</span>
                    <span className="text-white font-bold">{cls.bookedCount} / {cls.capacity}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      {/* Attendee Roster & Session Control Surface */}
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          {/* Active Class Telemetry Header */}
          <div className="p-5 sm:p-6 border-b border-[#1f1f26] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121217]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="volt" className="text-[10px] font-mono">{activeClass?.category.toUpperCase()}</Badge>
                <span className="text-xs font-mono text-[#71717a]">DURATION: {activeClass?.durationMinutes} MIN</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-heading">
                {activeClass?.title} Roster
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#a1a1aa] font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                  {activeClass?.room}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#a1a1aa]" aria-hidden="true" />
                  {classBookings.length} Enrolled ({attendedCount} Verified Present)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="bg-[#08080a] px-3.5 py-2 rounded-lg border border-[#1f1f26] text-center">
                <span className="text-[10px] text-[#71717a] block uppercase">Present</span>
                <span className="text-sm font-bold text-[#dfff00]">{attendedCount}</span>
              </div>
              <div className="bg-[#08080a] px-3.5 py-2 rounded-lg border border-[#1f1f26] text-center">
                <span className="text-[10px] text-[#71717a] block uppercase">Remaining</span>
                <span className="text-sm font-bold text-white">{classBookings.length - attendedCount}</span>
              </div>
            </div>
          </div>

          {/* Roster Listing */}
          {classBookings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
                <Users className="w-6 h-6" aria-hidden="true" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase font-heading">No Registered Athletes</h4>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                No members have booked into this class session yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1f1f26]">
              {classBookings.map((b) => {
                const isAttended = b.status === "attended";
                return (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121217] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center font-bold text-sm text-white font-mono shrink-0">
                        {b.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white font-heading">{b.userName}</h4>
                          <span className="text-[10px] font-mono text-[#71717a] bg-[#08080a] px-2 py-0.5 rounded border border-[#1f1f26]">
                            PASS: {b.checkInCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">{b.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Badge
                        variant={isAttended ? "success" : "volt"}
                        className="text-[10px] font-mono uppercase"
                      >
                        {isAttended ? "VERIFIED ATTENDED" : "CONFIRMED"}
                      </Badge>

                      {!isAttended && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="min-h-[40px] gap-1.5 bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38] font-mono text-xs"
                          onClick={() => handleMarkPresent(b.id, b.userName)}
                          isLoading={checkingInId === b.id}
                          disabled={checkingInId !== null}
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
                          {checkingInId === b.id ? "Checking In..." : "Mark Present"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SectionReveal>
    </div>
  );
}
