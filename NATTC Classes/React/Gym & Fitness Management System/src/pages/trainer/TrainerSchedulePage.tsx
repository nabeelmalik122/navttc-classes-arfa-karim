import React, { useState } from "react";
import { Clock, Calendar, CheckCircle2, Save, Power, ShieldAlert, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { notify } from "@/lib/notify";

const DAYS = [
  { day: "Monday", slots: ["06:00 - 12:00 (Floor Coach)", "14:00 - 18:00 (Private PT)"], active: true },
  { day: "Tuesday", slots: ["07:00 - 11:00 (Boxing Master)", "15:00 - 19:00 (Private PT)"], active: true },
  { day: "Wednesday", slots: ["06:00 - 12:00 (Floor Coach)", "14:00 - 18:00 (Private PT)"], active: true },
  { day: "Thursday", slots: ["08:00 - 12:00 (Mobility Master)", "16:00 - 20:00 (Private PT)"], active: true },
  { day: "Friday", slots: ["06:00 - 12:00 (Floor Coach)", "13:00 - 17:00 (Private PT)"], active: true },
  { day: "Saturday", slots: ["08:00 - 13:00 (Open Arena Supervision)"], active: true },
  { day: "Sunday", slots: ["Rest & Neural Recovery"], active: false },
];

export default function TrainerSchedulePage() {
  const [schedule, setSchedule] = useState<typeof DAYS>(() => {
    try {
      const saved = localStorage.getItem("ironyx-trainer-schedule");
      return saved ? JSON.parse(saved) : DAYS;
    } catch {
      return DAYS;
    }
  });

  const toggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    setSchedule(updated);
    notify.info({
      title: "SCHEDULE UPDATED",
      message: `${updated[index].day} status set to ${updated[index].active ? "Active Duty" : "Off-Duty"}.`,
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem("ironyx-trainer-schedule", JSON.stringify(schedule));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
    notify.success({
      title: "AVAILABILITY SAVED",
      message: "Coach availability preferences saved locally on this device.",
    });
  };

  const activeDaysCount = schedule.filter((d) => d.active).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">TIMETABLE MATRIX</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Coaching Schedule & Availability
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Define your allocated private coaching windows, arena supervisory shifts, and recovery blocks.
            </p>
          </div>

          <Button
            variant="volt"
            onClick={handleSave}
            className="gap-2 min-h-[44px] font-bold self-start sm:self-auto"
          >
            <Save className="w-4 h-4" aria-hidden="true" /> Save Availability
          </Button>
        </div>
      </SectionReveal>

      {/* Telemetry Summary Cards */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Active Floor Shifts</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {activeDaysCount} / 7 Days
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Arena duty rotation</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Weekly Floor Hours</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">
              ~42.0 Hours
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Floor coaching & 1-on-1 PT</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] col-span-2 sm:col-span-1 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Availability Settings</span>
            <div className="text-xs sm:text-sm font-bold font-mono text-amber-400 flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              LOCAL AVAILABILITY
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Preferences saved locally on device</p>
          </div>
        </div>
      </SectionReveal>

      {/* Day-by-Day Schedule Matrix Surface */}
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#1f1f26] flex items-center justify-between bg-[#121217]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Weekly Allocation Ledger
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#71717a]">
              Toggle shift status to update member calendar
            </span>
          </div>

          <div className="divide-y divide-[#1f1f26]">
            {schedule.map((item, idx) => (
              <div
                key={item.day}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121217] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white uppercase text-base font-heading">
                      {item.day}
                    </span>
                    <Badge
                      variant={item.active ? "success" : "default"}
                      className="text-[10px] font-mono uppercase border-[#1f1f26]"
                    >
                      {item.active ? "ON DUTY" : "OFF DUTY"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {item.slots.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-3 py-1 rounded-lg border text-[11px] ${
                          item.active
                            ? "bg-[#08080a] border-[#1f1f26] text-[#f4f4f5]"
                            : "bg-[#08080a]/50 border-[#1f1f26] text-[#71717a] line-through"
                        }`}
                      >
                        <Clock className="w-3 h-3 inline mr-1.5 text-[#dfff00]" aria-hidden="true" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="self-end sm:self-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="min-h-[40px] font-mono text-xs bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38]"
                    onClick={() => toggleDay(idx)}
                    aria-label={`Toggle duty status for ${item.day}`}
                  >
                    <Power className={`w-3.5 h-3.5 mr-1.5 ${item.active ? "text-amber-400" : "text-emerald-400"}`} aria-hidden="true" />
                    {item.active ? "Set Off-Duty" : "Enable Shift"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
