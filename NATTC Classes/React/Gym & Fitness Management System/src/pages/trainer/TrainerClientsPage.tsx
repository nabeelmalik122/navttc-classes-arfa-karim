import React, { useState } from "react";
import { Users, Search, Activity, Dumbbell, MessageSquare, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
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
import { notify } from "@/lib/notify";

const CLIENTS = [
  {
    id: "cli_01",
    name: "Sarah Jenkins",
    email: "sarah.connor@ironyxfitness.com",
    tier: "Pro Athlete",
    goal: "Athletic Conditioning & Barbell Mastery",
    lastActive: "Today",
    bench1RM: "77.5kg",
    squat1RM: "115kg",
    deadlift1RM: "140kg",
    coachNotes: "Focusing on elbow flare suppression during incline bench. Strong squat depth."
  },
  {
    id: "cli_02",
    name: "Marcus Vance",
    email: "marcus.vance@executive.com",
    tier: "Titan All-Access",
    goal: "Executive Energy & Hypertrophy",
    lastActive: "Yesterday",
    bench1RM: "120kg",
    squat1RM: "165kg",
    deadlift1RM: "210kg",
    coachNotes: "Adding extra scapular retract work to balance posture from desk hours."
  },
  {
    id: "cli_03",
    name: "David Chen",
    email: "dchen@techlabs.io",
    tier: "Foundation",
    goal: "Fat Loss & Sprint Speed",
    lastActive: "3 days ago",
    bench1RM: "90kg",
    squat1RM: "130kg",
    deadlift1RM: "160kg",
    coachNotes: "Consistent attendance on Tuesday/Thursday sprint circuits."
  }
];

export default function TrainerClientsPage() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<typeof CLIENTS>(() => {
    try {
      const saved = localStorage.getItem("ironyx-trainer-clients");
      return saved ? JSON.parse(saved) : CLIENTS;
    } catch {
      return CLIENTS;
    }
  });
  const [selectedClient, setSelectedClient] = useState<typeof CLIENTS[0] | null>(null);
  const [notes, setNotes] = useState("");

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenClient = (client: typeof CLIENTS[0]) => {
    setSelectedClient(client);
    setNotes(client.coachNotes);
  };

  const handleSaveNotes = () => {
    if (!selectedClient) return;
    const updated = clients.map((c) =>
      c.id === selectedClient.id ? { ...c, coachNotes: notes } : c
    );
    setClients(updated);
    try {
      localStorage.setItem("ironyx-trainer-clients", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
    notify.success({
      title: "NOTE SAVED LOCALLY",
      message: "Coach note saved on this device.",
    });
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">ATHLETE ROSTER</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Assigned Athlete Clients
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Review compound 1RM telemetry, kinematic milestones, and private coaching dossiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              {CLIENTS.length} ATHLETES ENROLLED
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Roster Controls: Search */}
      <SectionReveal delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <label htmlFor="athlete-search" className="sr-only">Search athlete roster</label>
            <Input
              id="athlete-search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-[#71717a]" />}
              className="bg-[#0c0c10] border-[#1f1f26] text-white min-h-[44px]"
            />
          </div>

          <span className="text-xs font-mono text-[#71717a]">
            Showing {filtered.length} of {CLIENTS.length} athletes
          </span>
        </div>
      </SectionReveal>

      {/* Athlete Roster Workspace */}
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
                <Users className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-heading">No Matching Athletes</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                No athlete in your assigned roster matches "{search}".
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Roster Table (Hidden on Mobile) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#08080a] text-[#71717a] uppercase border-b border-[#1f1f26]">
                    <tr>
                      <th scope="col" className="py-3.5 px-5">Athlete Name</th>
                      <th scope="col" className="py-3.5 px-5">Tier & Focus</th>
                      <th scope="col" className="py-3.5 px-5">Bench 1RM</th>
                      <th scope="col" className="py-3.5 px-5">Squat 1RM</th>
                      <th scope="col" className="py-3.5 px-5">Deadlift 1RM</th>
                      <th scope="col" className="py-3.5 px-5">Last Activity</th>
                      <th scope="col" className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f26]">
                    {filtered.map((cli) => (
                      <tr key={cli.id} className="hover:bg-[#121217] transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#121217] border border-[#1f1f26] flex items-center justify-center font-bold text-xs text-white font-mono shrink-0">
                              {cli.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-white font-heading">{cli.name}</div>
                              <div className="text-[11px] text-[#71717a]">{cli.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <Badge variant="volt" className="text-[10px]">{cli.tier}</Badge>
                          <div className="text-[11px] text-[#a1a1aa] truncate max-w-[200px] mt-1">{cli.goal}</div>
                        </td>
                        <td className="py-4 px-5 text-white font-bold">{cli.bench1RM}</td>
                        <td className="py-4 px-5 text-white font-bold">{cli.squat1RM}</td>
                        <td className="py-4 px-5 text-[#dfff00] font-bold">{cli.deadlift1RM}</td>
                        <td className="py-4 px-5 text-[#a1a1aa]">{cli.lastActive}</td>
                        <td className="py-4 px-5 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenClient(cli)}
                            className="min-h-[40px] bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38] font-mono text-xs gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                            Review Dossier
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Stacked Athlete Cards (Visible < lg) */}
              <div className="lg:hidden divide-y divide-[#1f1f26]">
                {filtered.map((cli) => (
                  <div key={cli.id} className="p-4 sm:p-5 space-y-4 hover:bg-[#121217] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center font-bold text-sm text-white font-mono shrink-0">
                          {cli.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white font-heading">{cli.name}</h3>
                          <p className="text-xs text-[#71717a] font-mono">{cli.email}</p>
                        </div>
                      </div>
                      <Badge variant="volt" className="text-[10px]">{cli.tier}</Badge>
                    </div>

                    <div className="text-xs text-[#a1a1aa] font-mono">
                      <span className="text-[#71717a]">Focus:</span> {cli.goal}
                    </div>

                    {/* 1RM Telemetry Badges */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="bg-[#08080a] p-2.5 rounded-lg border border-[#1f1f26]">
                        <span className="text-[#71717a] block text-[9px] uppercase">Bench 1RM</span>
                        <span className="font-bold text-white">{cli.bench1RM}</span>
                      </div>
                      <div className="bg-[#08080a] p-2.5 rounded-lg border border-[#1f1f26]">
                        <span className="text-[#71717a] block text-[9px] uppercase">Squat 1RM</span>
                        <span className="font-bold text-white">{cli.squat1RM}</span>
                      </div>
                      <div className="bg-[#08080a] p-2.5 rounded-lg border border-[#1f1f26]">
                        <span className="text-[#71717a] block text-[9px] uppercase">Deadlift 1RM</span>
                        <span className="font-bold text-[#dfff00]">{cli.deadlift1RM}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1f1f26]">
                      <span className="text-[11px] font-mono text-[#71717a]">
                        Active: {cli.lastActive}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="min-h-[40px] gap-1.5 bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38] text-xs font-mono"
                        onClick={() => handleOpenClient(cli)}
                      >
                        <FileText className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" />
                        Dossier & Notes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SectionReveal>

      {/* Athlete Dossier & Coach Notes Modal */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="bg-[#0c0c10] border-[#1f1f26] text-[#f4f4f5] max-w-lg">
            <DialogHeader>
              <DialogTitle className="uppercase font-heading text-xl text-white">
                {selectedClient.name} • Athlete Dossier
              </DialogTitle>
              <DialogDescription className="text-xs text-[#a1a1aa] font-mono">
                {selectedClient.tier} • Focus: {selectedClient.goal}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Telemetry Summary */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="bg-[#08080a] p-2.5 rounded-lg border border-[#1f1f26]">
                  <span className="text-[9px] text-[#71717a] uppercase block">Bench 1RM</span>
                  <span className="text-sm font-bold text-white">{selectedClient.bench1RM}</span>
                </div>
                <div className="bg-[#08080a] p-2.5 rounded-lg border border-[#1f1f26]">
                  <span className="text-[9px] text-[#71717a] uppercase block">Squat 1RM</span>
                  <span className="text-sm font-bold text-white">{selectedClient.squat1RM}</span>
                </div>
                <div className="bg-[#08080a] p-2.5 rounded-lg border border-[#1f1f26]">
                  <span className="text-[9px] text-[#71717a] uppercase block">Deadlift 1RM</span>
                  <span className="text-sm font-bold text-[#dfff00]">{selectedClient.deadlift1RM}</span>
                </div>
              </div>

              {/* Private Notes Field */}
              <div>
                <label htmlFor="coach-notes-input" className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5">
                  Private Coach Notes & Kinematic Adjustments
                </label>
                <textarea
                  id="coach-notes-input"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record coaching observations, elbow/wrist cueing, or periodization notes..."
                  className="w-full rounded-xl border border-[#1f1f26] bg-[#08080a] p-3 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#dfff00] font-mono leading-relaxed"
                />
                <p className="text-[10px] text-[#71717a] font-mono mt-1.5">
                  Coach notes are saved locally on this device.
                </p>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedClient(null)}
                  className="min-h-[44px] text-[#a1a1aa] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="volt"
                  onClick={handleSaveNotes}
                  className="min-h-[44px] font-bold"
                >
                  Save Dossier Notes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
