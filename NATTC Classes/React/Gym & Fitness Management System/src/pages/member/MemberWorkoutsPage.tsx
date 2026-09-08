import React, { useState } from "react";
import { Dumbbell, Play, CheckCircle2, RotateCcw, Clock, Target, Flame, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";

export default function MemberWorkoutsPage() {
  const workouts = useGymStore((s) => s.workouts);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(workouts[0]?.id || "");
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  const currentWorkout = workouts.find((w) => w.id === selectedWorkoutId) || workouts[0];

  const toggleSet = (key: string) => {
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetSets = () => {
    if (!currentWorkout) return;
    const newSets = { ...completedSets };
    currentWorkout.exercises.forEach((ex) => {
      for (let i = 1; i <= ex.sets; i++) {
        delete newSets[`${ex.id}_set_${i}`];
      }
    });
    setCompletedSets(newSets);
    notify.info({
      title: "PROTOCOL RESET",
      message: "Session set progress has been reset.",
    });
  };

  const handleFinishWorkout = () => {
    notify.info({
      title: "TELEMETRY NOTICE",
      message: "Completion tracking is not available yet.",
    });
  };

  // Calculate session progress
  const totalSets = currentWorkout?.exercises.reduce((acc, ex) => acc + ex.sets, 0) || 0;
  const completedSetsCount = currentWorkout?.exercises.reduce((acc, ex) => {
    let count = 0;
    for (let i = 1; i <= ex.sets; i++) {
      if (completedSets[`${ex.id}_set_${i}`]) count++;
    }
    return acc + count;
  }, 0) || 0;

  const progressPercent = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

  if (!currentWorkout) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <SectionReveal>
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">TRAINING PROTOCOL</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Active Protocol
            </h1>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
              <Dumbbell className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white uppercase font-heading">No Assigned Protocols</h2>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                Your performance coach has not assigned a routine to your profile yet.
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="volt" className="text-[10px] font-mono tracking-wider">ACTIVE PROTOCOL</Badge>
              <Badge variant="default" className="text-[10px] font-mono uppercase text-[#a1a1aa] border-[#1f1f26]">
                {currentWorkout.difficulty}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1 leading-tight">
              {currentWorkout.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono mt-0.5">
              Designed by Coach {currentWorkout.trainerName || "Alex Thorne"} • {currentWorkout.estimatedDurationMinutes} Min Target
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            {completedSetsCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetSets}
                className="text-[#a1a1aa] hover:text-white hover:bg-[#16161b] min-h-[44px] whitespace-nowrap shrink-0"
                aria-label="Reset current session progress"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" /> Reset
              </Button>
            )}
            <Button
              variant="secondary"
              size="lg"
              className="min-h-[44px] gap-2 font-mono text-xs opacity-75 hover:opacity-100 whitespace-nowrap shrink-0 border border-[#1f1f26]"
              onClick={handleFinishWorkout}
              title="Completion tracking is not available yet"
            >
              <Clock className="w-4 h-4 shrink-0 text-[#a1a1aa]" aria-hidden="true" /> Completion Tracking Unavailable
            </Button>
          </div>
        </div>
      </SectionReveal>

      {/* Routine Selector (if multiple routines) & Telemetry Strip */}
      <SectionReveal delay={0.05}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-4 sm:p-6 space-y-4">
          {workouts.length > 1 && (
            <div className="flex flex-wrap gap-2 pb-4 border-b border-[#1f1f26]">
              {workouts.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWorkoutId(w.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-colors min-h-[40px] ${
                    w.id === currentWorkout.id
                      ? "bg-[#dfff00] text-black"
                      : "bg-[#121217] text-[#a1a1aa] hover:text-white border border-[#1f1f26]"
                  }`}
                >
                  {w.title}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">Target Focus</span>
              <div className="text-xs font-bold text-white uppercase truncate flex items-center h-5">
                {currentWorkout.targetMuscleGroup?.join(", ") || "Full Body"}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">Est. Duration</span>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5 h-5">
                <Clock className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                {currentWorkout.estimatedDurationMinutes} MIN
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">Total Exercises</span>
              <div className="text-xs font-bold text-white font-mono flex items-center h-5">
                {currentWorkout.exercises.length} Movements
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="text-[#71717a]">Protocol Volume</span>
                <span className="text-[#dfff00] font-bold">{progressPercent}%</span>
              </div>
              <div className="flex items-center h-5">
                <div className="w-full h-2.5 rounded-full bg-[#16161b] overflow-hidden border border-[#1f1f26]">
                  <div
                    className="h-full bg-[#dfff00] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(223,255,0,0.4)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Exercises & Interactive Sets Tracker */}
      <SectionReveal delay={0.1}>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">
              Movement Architecture ({currentWorkout.exercises.length})
            </h2>
            <span className="text-[10px] font-mono text-[#71717a]">
              {completedSetsCount} of {totalSets} Sets Logged
            </span>
          </div>

          <div className="space-y-4">
            {currentWorkout.exercises.map((ex, exIndex) => (
              <div
                key={ex.id}
                className="rounded-2xl border border-[#1f1f26] bg-[#121217] p-5 sm:p-6 space-y-4"
              >
                {/* Exercise Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f1f26]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#08080a] border border-[#1f1f26] flex items-center justify-center font-mono font-bold text-[#dfff00] text-xs shrink-0">
                      {String(exIndex + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white uppercase font-heading">
                        {ex.name}
                      </h3>
                      {ex.notes && (
                        <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">{ex.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default" className="font-mono text-[10px] uppercase border-[#1f1f26] text-[#a1a1aa]">
                      {ex.equipment}
                    </Badge>
                    <Badge variant="volt" className="font-mono text-[10px]">
                      Rest: {ex.restSeconds}s
                    </Badge>
                  </div>
                </div>

                {/* Sets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Array.from({ length: ex.sets }).map((_, setIdx) => {
                    const key = `${ex.id}_set_${setIdx + 1}`;
                    const isDone = !!completedSets[key];

                    return (
                      <button
                        key={setIdx}
                        type="button"
                        onClick={() => toggleSet(key)}
                        aria-pressed={isDone}
                        aria-label={`Toggle Set ${setIdx + 1} for ${ex.name}`}
                        className={`min-h-[48px] p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          isDone
                            ? "bg-[#16161b] border-[#dfff00] text-white"
                            : "bg-[#08080a] border-[#1f1f26] text-[#a1a1aa] hover:border-[#2e2e38]"
                        }`}
                      >
                        <div>
                          <span className={`text-[10px] font-mono font-bold uppercase block ${isDone ? "text-[#dfff00]" : "text-[#71717a]"}`}>
                            Set {setIdx + 1}
                          </span>
                          <span className="text-xs font-mono font-bold text-white">
                            {ex.reps} Reps • RPE {ex.targetRPE || 8.0}
                          </span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                            isDone
                              ? "bg-[#dfff00] border-[#dfff00] text-black"
                              : "border-[#2e2e38] bg-[#0c0c10] text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
