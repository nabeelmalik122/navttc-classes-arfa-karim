import React, { useState } from "react";
import { Dumbbell, Plus, Trash2, Save, Check, Clock, Flame, Target, Layers, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";
import type { Exercise } from "@/types";

export default function TrainerWorkoutsPage() {
  const workouts = useGymStore((s) => s.workouts);
  const addWorkout = useGymStore((s) => s.addWorkout);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "elite">("intermediate");

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "ex_new_1",
      name: "Barbell Back Squat",
      category: "legs",
      equipment: "barbell",
      sets: 4,
      reps: "6-8",
      restSeconds: 120,
      notes: "Drive hips through at top"
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: `ex_new_${Date.now()}`,
        name: "",
        category: "chest",
        equipment: "barbell",
        sets: 3,
        reps: "8-10",
        restSeconds: 90,
      }
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    if (exercises.length <= 1) {
      notify.warning({
        title: "VALIDATION ERROR",
        message: "A protocol must contain at least one prescribed movement.",
      });
      return;
    }
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSaveProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!title.trim()) {
      notify.warning({
        title: "VALIDATION ERROR",
        message: "Please provide a protocol title.",
      });
      return;
    }

    const hasEmptyName = exercises.some((ex) => !ex.name.trim());
    if (hasEmptyName) {
      notify.warning({
        title: "VALIDATION ERROR",
        message: "All prescribed exercises must have a valid name.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await addWorkout({
        title: title.trim(),
        description: description.trim() || "Prescribed high-performance training protocol.",
        difficulty,
        targetMuscleGroup: ["Full Body"],
        estimatedDurationMinutes: parseInt(duration) || 60,
        createdBy: "trn_001",
        trainerName: "Alex 'Titan' Thorne",
        assignedToUserIds: ["usr_member_001"],
        exercises,
        tags: ["Coach Protocol", "Hypertrophy"]
      });

      notify.success({
        title: "PROTOCOL PUBLISHED",
        message: "New workout protocol published and distributed to athlete rosters.",
      });
      setTitle("");
      setDescription("");
      setExercises([
        {
          id: `ex_new_${Date.now()}`,
          name: "Barbell Incline Bench Press",
          category: "chest",
          equipment: "barbell",
          sets: 4,
          reps: "8-10",
          restSeconds: 90,
          notes: "Retract scapulae and touch chest smoothly."
        }
      ]);
    } catch (err) {
      notify.error({
        title: "PUBLISH FAILED",
        message: "Failed to publish workout protocol. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">PERIODIZATION LAB</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Workout Protocol Builder
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Author customized periodized training routines, prescribe movement architecture, and assign to athlete rosters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              {workouts.length} ACTIVE PROTOCOLS ON LEDGER
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Published Protocols Ledger */}
      <SectionReveal delay={0.05}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#1f1f26] flex items-center justify-between bg-[#121217]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Active Published Protocols ({workouts.length})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#71717a]">
              Available for member assignment
            </span>
          </div>

          <div className="divide-y divide-[#1f1f26]">
            {workouts.map((w) => (
              <div
                key={w.id}
                className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[#121217]/70 transition-colors"
              >
                {/* Left Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={w.difficulty === "elite" ? "volt" : w.difficulty === "intermediate" ? "default" : "secondary"}
                      className="text-[10px] font-mono uppercase tracking-wider font-bold"
                    >
                      {w.difficulty}
                    </Badge>
                    <span className="text-xs font-mono text-[#a1a1aa] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#08080a] border border-[#1f1f26]">
                      <Clock className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                      {w.estimatedDurationMinutes} MIN
                    </span>
                    {w.targetMuscleGroup && w.targetMuscleGroup.length > 0 && (
                      <span className="text-[11px] font-mono text-[#71717a] hidden sm:inline-block">
                        • {w.targetMuscleGroup.join(" • ")}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white uppercase font-heading tracking-wide">
                      {w.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a1a1aa] mt-0.5 line-clamp-2 leading-relaxed">
                      {w.description}
                    </p>
                  </div>
                </div>

                {/* Right Stats & Status Badge */}
                <div className="flex items-center gap-3.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#1f1f26]/60 justify-between lg:justify-end">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#08080a] border border-[#1f1f26]">
                    <Dumbbell className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
                    <span className="text-xs font-mono font-bold text-white">
                      {w.exercises.length} {w.exercises.length === 1 ? "Exercise" : "Exercises"}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/50 border border-emerald-800/60 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    LIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Protocol Builder Form */}
      <SectionReveal delay={0.1}>
        <form
          onSubmit={handleSaveProtocol}
          className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-[#1f1f26] pb-4">
            <h2 className="text-base font-bold text-white uppercase font-heading">
              New Training Routine Specification
            </h2>
            <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">
              Define the routine header, duration target, and set/rep progression.
            </p>
          </div>

          {/* Routine Header Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="proto-title" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Protocol Title *
              </label>
              <Input
                id="proto-title"
                required
                placeholder="e.g. Posterior Chain Explosive Power"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
              />
            </div>

            <div>
              <label htmlFor="proto-duration" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Estimated Duration (Mins)
              </label>
              <Input
                id="proto-duration"
                type="number"
                min="10"
                max="180"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="proto-desc" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Protocol Focus & Periodization Notes
              </label>
              <Input
                id="proto-desc"
                placeholder="e.g. Focus on eccentric velocity control and strict hamstring tension..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
              />
            </div>

            <div>
              <label htmlFor="proto-difficulty" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                Target Difficulty
              </label>
              <div className="relative">
                <select
                  id="proto-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "beginner" | "intermediate" | "elite")}
                  className="w-full appearance-none rounded-xl border border-[#1f1f26] bg-[#08080a] pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#dfff00] font-mono min-h-[44px] cursor-pointer"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="elite">Elite / High Performance</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#71717a] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Exercises List Builder */}
          <div className="space-y-4 pt-4 border-t border-[#1f1f26]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Prescribed Movement Architecture ({exercises.length})
                </h3>
                <p className="text-[11px] text-[#71717a] font-mono">
                  Configure movement sequence, volume load, and recovery intervals.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddExercise}
                className="gap-1.5 text-xs font-mono min-h-[40px] bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38]"
              >
                <Plus className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" /> Add Exercise
              </Button>
            </div>

            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl bg-[#08080a] border border-[#1f1f26] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#121217] border border-[#1f1f26] flex items-center justify-center font-mono font-bold text-[#dfff00] text-[11px]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-mono uppercase text-[#71717a] font-bold">
                        Movement {idx + 1}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(idx)}
                      className="p-2 text-[#71717a] hover:text-red-400 transition-colors rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
                      aria-label={`Remove exercise movement ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 items-center">
                    <div className="col-span-2">
                      <label htmlFor={`ex-name-${idx}`} className="sr-only">Exercise Name</label>
                      <Input
                        id={`ex-name-${idx}`}
                        value={ex.name}
                        placeholder="Exercise name (e.g. Incline Bench)"
                        onChange={(e) => {
                          const updated = [...exercises];
                          updated[idx].name = e.target.value;
                          setExercises(updated);
                        }}
                        className="bg-[#0c0c10] border-[#1f1f26] text-white text-xs min-h-[44px]"
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor={`ex-sets-${idx}`} className="sr-only">Sets</label>
                      <Input
                        id={`ex-sets-${idx}`}
                        type="number"
                        min="1"
                        max="20"
                        value={ex.sets}
                        placeholder="Sets"
                        onChange={(e) => {
                          const updated = [...exercises];
                          updated[idx].sets = parseInt(e.target.value) || 3;
                          setExercises(updated);
                        }}
                        className="bg-[#0c0c10] border-[#1f1f26] text-white text-xs min-h-[44px]"
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor={`ex-reps-${idx}`} className="sr-only">Reps</label>
                      <Input
                        id={`ex-reps-${idx}`}
                        value={ex.reps}
                        placeholder="Reps (e.g. 6-8)"
                        onChange={(e) => {
                          const updated = [...exercises];
                          updated[idx].reps = e.target.value;
                          setExercises(updated);
                        }}
                        className="bg-[#0c0c10] border-[#1f1f26] text-white text-xs min-h-[44px]"
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor={`ex-rest-${idx}`} className="sr-only">Rest Seconds</label>
                      <Input
                        id={`ex-rest-${idx}`}
                        type="number"
                        min="0"
                        step="15"
                        value={ex.restSeconds}
                        placeholder="Rest (s)"
                        onChange={(e) => {
                          const updated = [...exercises];
                          updated[idx].restSeconds = parseInt(e.target.value) || 60;
                          setExercises(updated);
                        }}
                        className="bg-[#0c0c10] border-[#1f1f26] text-white text-xs min-h-[44px]"
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor={`ex-equipment-${idx}`} className="sr-only">Equipment</label>
                      <div className="relative">
                        <select
                          id={`ex-equipment-${idx}`}
                          value={ex.equipment}
                          onChange={(e) => {
                            const updated = [...exercises];
                            updated[idx].equipment = e.target.value as Exercise["equipment"];
                            setExercises(updated);
                          }}
                          className="w-full appearance-none rounded-xl border border-[#1f1f26] bg-[#0c0c10] pl-3 pr-8 py-2.5 text-xs text-[#f4f4f5] focus:outline-none focus:border-[#dfff00] font-mono min-h-[44px] cursor-pointer"
                        >
                          <option value="barbell">Barbell</option>
                          <option value="dumbbell">Dumbbell</option>
                          <option value="cable">Cable</option>
                          <option value="machine">Machine</option>
                          <option value="bodyweight">Bodyweight</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#71717a] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1f1f26] flex justify-end">
            <Button
              type="submit"
              variant="volt"
              size="lg"
              className="gap-2 min-h-[44px] font-bold w-full sm:w-auto"
              isLoading={isSaving}
              disabled={isSaving}
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {isSaving ? "Publishing Protocol..." : "Publish & Assign Protocol"}
            </Button>
          </div>
        </form>
      </SectionReveal>
    </div>
  );
}
