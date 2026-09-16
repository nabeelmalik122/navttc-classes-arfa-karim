import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, Plus, Dumbbell, Scale, Calendar, ArrowUpRight, History } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/Modal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";
import { CountUp } from "@/components/reactbits";
import { useReducedMotion } from "@/utils/motion";

export default function MemberProgressPage() {
  const progress = useGymStore((s) => s.progress);
  const addProgressEntry = useGymStore((s) => s.addProgressEntry);
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  // Form states with fallback to latest recorded or typical starter baseline
  const latestEntry = progress[progress.length - 1];
  const [weightKg, setWeightKg] = useState(latestEntry ? String(latestEntry.weightKg) : "65.0");
  const [benchKg, setBenchKg] = useState(latestEntry?.benchPressMaxKg ? String(latestEntry.benchPressMaxKg) : "75.0");
  const [squatKg, setSquatKg] = useState(latestEntry?.squatMaxKg ? String(latestEntry.squatMaxKg) : "110.0");
  const [deadliftKg, setDeadliftKg] = useState(latestEntry?.deadliftMaxKg ? String(latestEntry.deadliftMaxKg) : "135.0");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSaving) return;

    const parsedWeight = parseFloat(weightKg);
    const parsedBench = parseFloat(benchKg);
    const parsedSquat = parseFloat(squatKg);
    const parsedDeadlift = parseFloat(deadliftKg);

    if (
      isNaN(parsedWeight) || parsedWeight <= 0 ||
      isNaN(parsedBench) || parsedBench < 0 ||
      isNaN(parsedSquat) || parsedSquat < 0 ||
      isNaN(parsedDeadlift) || parsedDeadlift < 0
    ) {
      notify.warning({
        title: "INVALID METRIC VALUES",
        message: "Please enter valid numeric weight and strength 1RM measurements.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await addProgressEntry({
        userId: user.uid,
        date: new Date().toISOString().split("T")[0],
        weightKg: parsedWeight,
        benchPressMaxKg: parsedBench,
        squatMaxKg: parsedSquat,
        deadliftMaxKg: parsedDeadlift,
      });

      notify.success({
        title: "METRICS RECORDED",
        message: "Performance metrics and strength data logged successfully.",
      });
      setModalOpen(false);
    } catch (err) {
      notify.error({
        title: "LOG FAILED",
        message: "Failed to log performance metrics. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Extract actual recorded highlights from existing progress data
  const maxDeadlift = progress.reduce((max, p) => Math.max(max, p.deadliftMaxKg || 0), 0);
  const maxSquat = progress.reduce((max, p) => Math.max(max, p.squatMaxKg || 0), 0);
  const maxBench = progress.reduce((max, p) => Math.max(max, p.benchPressMaxKg || 0), 0);
  const currentWeight = latestEntry ? latestEntry.weightKg : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">ATHLETE PERFORMANCE METRICS</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Performance Progression
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Longitudinal body composition and compound 1RM strength tracking.
            </p>
          </div>

          <Button
            variant="volt"
            className="gap-2 min-h-[44px] font-bold self-start sm:self-auto"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Log Performance Metric
          </Button>
        </div>
      </SectionReveal>

      {/* Metric Summary Cards */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <div className="flex items-center justify-between text-[#71717a]">
              <span className="text-[10px] font-mono uppercase tracking-wider">Scale Weight</span>
              <Scale className="w-3.5 h-3.5 text-[#a1a1aa]" aria-hidden="true" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {currentWeight > 0 ? <><CountUp end={currentWeight} decimals={1} /> kg</> : "--"}
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Latest weigh-in</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <div className="flex items-center justify-between text-[#71717a]">
              <span className="text-[10px] font-mono uppercase tracking-wider">Deadlift PR</span>
              <Dumbbell className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">
              {maxDeadlift > 0 ? <><CountUp end={maxDeadlift} decimals={1} /> kg</> : "--"}
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Peak 1RM recorded</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <div className="flex items-center justify-between text-[#71717a]">
              <span className="text-[10px] font-mono uppercase tracking-wider">Squat PR</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#a1a1aa]" aria-hidden="true" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {maxSquat > 0 ? <><CountUp end={maxSquat} decimals={1} /> kg</> : "--"}
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Peak 1RM recorded</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <div className="flex items-center justify-between text-[#71717a]">
              <span className="text-[10px] font-mono uppercase tracking-wider">Bench PR</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#a1a1aa]" aria-hidden="true" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {maxBench > 0 ? <><CountUp end={maxBench} decimals={1} /> kg</> : "--"}
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Peak 1RM recorded</p>
          </div>
        </div>
      </SectionReveal>

      {/* Main Charts Grid */}
      {progress.length === 0 ? (
        <SectionReveal delay={0.1}>
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
              <Scale className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white uppercase font-heading">No Performance Metrics Recorded</h2>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                Log your first bodyweight or compound strength 1RM above to initiate tracking.
              </p>
            </div>
          </div>
        </SectionReveal>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strength Curve */}
          <SectionReveal delay={0.1}>
            <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase font-heading">
                    Compound 1RM Trajectory (kg)
                  </h2>
                  <p className="text-xs text-[#71717a] font-mono">Deadlift, Squat, and Bench 1RM entries over time</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-[#dfff00]">
                    <span className="w-2 h-2 rounded-full bg-[#dfff00]" /> Deadlift
                  </span>
                  <span className="flex items-center gap-1 text-white">
                    <span className="w-2 h-2 rounded-full bg-white" /> Squat
                  </span>
                  <span className="flex items-center gap-1 text-[#a1a1aa]">
                    <span className="w-2 h-2 rounded-full bg-[#a1a1aa]" /> Bench
                  </span>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f26" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0c0c10",
                        borderColor: "#1f1f26",
                        borderRadius: "8px",
                        color: "#f4f4f5",
                        fontSize: "11px",
                        fontFamily: "monospace"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="deadliftMaxKg"
                      name="Deadlift"
                      stroke="#dfff00"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#dfff00", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#dfff00" }}
                      isAnimationActive={!prefersReduced}
                    />
                    <Line
                      type="monotone"
                      dataKey="squatMaxKg"
                      name="Squat"
                      stroke="#ffffff"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#ffffff", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#ffffff" }}
                      isAnimationActive={!prefersReduced}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchPressMaxKg"
                      name="Bench"
                      stroke="#a1a1aa"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#a1a1aa", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#a1a1aa" }}
                      isAnimationActive={!prefersReduced}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionReveal>

          {/* Bodyweight Curve */}
          <SectionReveal delay={0.15}>
            <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase font-heading">
                    Scale Bodyweight (kg)
                  </h2>
                  <p className="text-xs text-[#71717a] font-mono">Calibrated scale measurements logged chronologically</p>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono self-start sm:self-auto border-[#4f9dff]/40 text-[#4f9dff] bg-[#4f9dff]/10">
                  SCALE TELEMETRY
                </Badge>
              </div>

              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progress}>
                    <defs>
                      <linearGradient id="bodyweightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f9dff" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#4f9dff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f26" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0c0c10",
                        borderColor: "#1f1f26",
                        borderRadius: "8px",
                        color: "#f4f4f5",
                        fontSize: "11px",
                        fontFamily: "monospace"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weightKg"
                      name="Bodyweight"
                      stroke="#4f9dff"
                      strokeWidth={2}
                      fill="url(#bodyweightGradient)"
                      isAnimationActive={!prefersReduced}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionReveal>
        </div>
      )}

      {/* Accessible Historical Log Table */}
      {progress.length > 0 && (
        <SectionReveal delay={0.2}>
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#1f1f26] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Telemetry Ledger History
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#71717a]">
                {progress.length} Total Logs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#08080a] text-[#71717a] uppercase border-b border-[#1f1f26]">
                  <tr>
                    <th scope="col" className="py-3 px-4">Date</th>
                    <th scope="col" className="py-3 px-4">Bodyweight</th>
                    <th scope="col" className="py-3 px-4">Bench 1RM</th>
                    <th scope="col" className="py-3 px-4">Squat 1RM</th>
                    <th scope="col" className="py-3 px-4">Deadlift 1RM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f26]">
                  {progress.slice().reverse().map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#121217] transition-colors">
                      <td className="py-3.5 px-4 text-[#f4f4f5] font-bold">{entry.date}</td>
                      <td className="py-3.5 px-4 text-[#a1a1aa]">{entry.weightKg ? `${entry.weightKg} kg` : "--"}</td>
                      <td className="py-3.5 px-4 text-[#a1a1aa]">{entry.benchPressMaxKg ? `${entry.benchPressMaxKg} kg` : "--"}</td>
                      <td className="py-3.5 px-4 text-[#a1a1aa]">{entry.squatMaxKg ? `${entry.squatMaxKg} kg` : "--"}</td>
                      <td className="py-3.5 px-4 text-[#dfff00] font-bold">{entry.deadliftMaxKg ? `${entry.deadliftMaxKg} kg` : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionReveal>
      )}

      {/* Metric Log Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="bg-[#0c0c10] border-[#1f1f26] text-[#f4f4f5] max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading uppercase text-xl text-white">Log Performance Metric Entry</DialogTitle>
              <DialogDescription className="text-xs text-[#a1a1aa] font-mono">
                Record your scale bodyweight and compound 1RM strength lifts.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddEntry} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight-input" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Scale Weight (kg)
                  </label>
                  <Input
                    id="weight-input"
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    required
                    className="min-h-[44px] bg-[#08080a] border-[#1f1f26] text-white focus:border-[#dfff00]"
                  />
                </div>
                <div>
                  <label htmlFor="bench-input" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Bench 1RM (kg)
                  </label>
                  <Input
                    id="bench-input"
                    type="number"
                    step="0.5"
                    value={benchKg}
                    onChange={(e) => setBenchKg(e.target.value)}
                    required
                    className="min-h-[44px] bg-[#08080a] border-[#1f1f26] text-white focus:border-[#dfff00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="squat-input" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Squat 1RM (kg)
                  </label>
                  <Input
                    id="squat-input"
                    type="number"
                    step="0.5"
                    value={squatKg}
                    onChange={(e) => setSquatKg(e.target.value)}
                    required
                    className="min-h-[44px] bg-[#08080a] border-[#1f1f26] text-white focus:border-[#dfff00]"
                  />
                </div>
                <div>
                  <label htmlFor="deadlift-input" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Deadlift 1RM (kg)
                  </label>
                  <Input
                    id="deadlift-input"
                    type="number"
                    step="0.5"
                    value={deadliftKg}
                    onChange={(e) => setDeadliftKg(e.target.value)}
                    required
                    className="min-h-[44px] bg-[#08080a] border-[#1f1f26] text-white focus:border-[#dfff00]"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  className="min-h-[44px] text-[#a1a1aa] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="volt"
                  className="min-h-[44px] font-bold"
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Metrics..." : "Save Metrics"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
