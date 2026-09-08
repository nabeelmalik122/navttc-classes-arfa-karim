import React, { useState } from "react";
import { Calendar, Plus, Trash2, Edit3, Clock, Users, Flame, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
import { notify } from "@/lib/notify";
import type { ClassCategory, ClassIntensity } from "@/types";

export default function AdminClassesPage() {
  const classes = useGymStore((s) => s.classes);
  const addClass = useGymStore((s) => s.addClass);
  const deleteClass = useGymStore((s) => s.deleteClass);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ClassCategory>("strength");
  const [intensity, setIntensity] = useState<ClassIntensity>("advanced");
  const [duration, setDuration] = useState("50");
  const [capacity, setCapacity] = useState("18");
  const [room, setRoom] = useState("Zone A: Heavy Iron Vault");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [trainerName, setTrainerName] = useState("Alex 'Titan' Thorne");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    const categoryImages: Record<string, string> = {
      boxing: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
      hiit: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      strength: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      mobility: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      recovery: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    };

    setIsSubmitting(true);
    try {
      await addClass({
        title: title.trim(),
        description: description.trim() || "High-intensity athletic protocol led by master coaching staff.",
        category,
        intensity,
        trainerId: "trn_001",
        trainerName,
        trainerAvatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80",
        durationMinutes: parseInt(duration) || 50,
        capacity: parseInt(capacity) || 18,
        room,
        scheduleDays: [1, 3, 5],
        startTime,
        imageUrl: categoryImages[category] || categoryImages.strength,
        calorieBurnEstimate: 600,
        status: "active"
      });

      notify.success({
        title: "MASTER CLASS SCHEDULED",
        message: `Master class "${title}" scheduled on arena timetable.`,
      });
      setModalOpen(false);
      setTitle("");
      setDescription("");
    } catch (err) {
      notify.error({
        title: "SCHEDULING FAILED",
        message: "Failed to schedule class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteClass(id);
      notify.success({
        title: "CLASS REMOVED",
        message: `Removed class ${name} from active schedule.`,
      });
    } catch (err) {
      notify.error({
        title: "REMOVAL FAILED",
        message: `Failed to remove class ${name}.`,
      });
    }
  };

  const totalBooked = classes.reduce((sum, c) => sum + c.bookedCount, 0);
  const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">PROGRAMMING & TIMETABLE</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Master Class Programming
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Create arena sessions, set athlete capacity caps, and allocate coaching staff.
            </p>
          </div>

          <Button
            variant="volt"
            onClick={() => setModalOpen(true)}
            className="gap-2 min-h-[44px] font-bold self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Schedule Master Class
          </Button>
        </div>
      </SectionReveal>

      {/* Programming Telemetry Strip */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Scheduled Sessions</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">{classes.length} Classes</div>
            <p className="text-[10px] text-[#71717a] font-mono">Active on weekly schedule</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Roster Capacity Load</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">
              {totalBooked} / {totalCapacity}
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">
              {totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0}% booked capacity
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] col-span-2 sm:col-span-1 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Coaching Allocations</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">100% Staffed</div>
            <p className="text-[10px] text-[#71717a] font-mono">Zero unassigned floor sessions</p>
          </div>
        </div>
      </SectionReveal>

      {/* Class Management Grid */}
      <SectionReveal delay={0.1}>
        {classes.length === 0 ? (
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
              <Calendar className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase font-heading">No Classes Scheduled</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                There are no active master classes on the timetable. Schedule a session using the button above.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {classes.map((cls) => {
              const pct = cls.capacity > 0 ? Math.round((cls.bookedCount / cls.capacity) * 100) : 0;
              return (
                <div
                  key={cls.id}
                  className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#2e2e38] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="volt" className="text-[10px] font-mono uppercase">
                        {cls.category}
                      </Badge>
                    <span className="text-xs font-mono text-[#dfff00] font-bold">
                      {cls.startTime}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white uppercase font-heading break-words">
                      {cls.title}
                    </h2>
                    <p className="text-xs text-[#71717a] font-mono mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                      {cls.room}
                    </p>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-[#1f1f26]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a]">
                      <span>Enrolled: {cls.bookedCount} / {cls.capacity}</span>
                      <span className="text-white font-bold">{pct}% Full</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#16161b] overflow-hidden border border-[#1f1f26]">
                      <div
                        className="h-full bg-[#dfff00] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs font-mono text-[#a1a1aa]">
                    Coach: <span className="text-white font-bold">{cls.trainerName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1f1f26] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#71717a]">{cls.durationMinutes} Mins</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(cls.id, cls.title)}
                    className="p-2 rounded-lg text-[#71717a] hover:text-red-400 hover:bg-[#16161b] transition-colors"
                    aria-label={`Delete class ${cls.title}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </SectionReveal>

      {/* Create Class Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="bg-[#0c0c10] border-[#1f1f26] text-[#f4f4f5] max-w-lg">
            <DialogHeader>
              <DialogTitle className="uppercase font-heading text-xl text-white">
                Create Master Class Schedule
              </DialogTitle>
              <DialogDescription className="text-xs text-[#a1a1aa] font-mono">
                Define session title, allocated room, coach, and athlete capacity.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateClass} className="space-y-4 py-2">
              <div>
                <label htmlFor="class-title" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Class Title *
                </label>
                <Input
                  id="class-title"
                  required
                  placeholder="e.g. Olympic Clean & Snatch Mechanics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="class-cat" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Category
                  </label>
                  <select
                    id="class-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ClassCategory)}
                    className="w-full h-11 rounded-xl border border-[#1f1f26] bg-[#08080a] px-3 text-xs text-white focus:outline-none focus:border-[#dfff00] font-mono"
                  >
                    <option value="strength">Strength</option>
                    <option value="boxing">Boxing</option>
                    <option value="hiit">HIIT & Turf</option>
                    <option value="mobility">Mobility</option>
                    <option value="recovery">Recovery</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="class-time" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Start Time
                  </label>
                  <Input
                    id="class-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="class-cap" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Capacity Cap
                  </label>
                  <Input
                    id="class-cap"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                  />
                </div>
                <div>
                  <label htmlFor="class-dur" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                    Duration (Minutes)
                  </label>
                  <Input
                    id="class-dur"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="class-room" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Allocated Room / Zone
                </label>
                <Input
                  id="class-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="bg-[#08080a] border-[#1f1f26] text-white min-h-[44px] focus:border-[#dfff00]"
                />
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
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Master Class"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
