import React, { useState, useEffect } from "react";
import { Users, Search, Plus, Shield, CheckCircle2, XCircle, MoreVertical, UserCheck, Activity, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { notify } from "@/lib/notify";
import { isFirebaseConfigured } from "@/services/firebase/firebase.config";
import { FirestoreService } from "@/services/firebase/firestore.service";

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: "active" | "suspended" | "past_due" | "inactive";
  joined: string;
  checkIns: number;
}

const DEMO_MEMBERS: MemberRecord[] = [
  { id: "usr_001", name: "Sarah Jenkins", email: "sarah.connor@ironxfitness.com", tier: "Pro Athlete", status: "active", joined: "2025-06-01", checkIns: 84 },
  { id: "usr_002", name: "Marcus Vance", email: "marcus.vance@executive.com", tier: "Titan All-Access", status: "active", joined: "2025-01-10", checkIns: 128 },
  { id: "usr_003", name: "David Chen", email: "dchen@techlabs.io", tier: "Foundation", status: "active", joined: "2025-09-15", checkIns: 42 },
  { id: "usr_004", name: "Elena Rostova", email: "elena.r@combat.com", tier: "Titan All-Access", status: "active", joined: "2025-02-15", checkIns: 195 },
  { id: "usr_005", name: "Michael Brody", email: "mbrody@investors.com", tier: "Pro Athlete", status: "past_due", joined: "2025-11-20", checkIns: 19 },
];

export default function AdminMembersPage() {
  const isProductionAuth = isFirebaseConfigured && import.meta.env.VITE_ENABLE_DEMO_AUTH !== "true";

  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (isProductionAuth) {
      setIsLoading(true);
      setLoadError(null);

      FirestoreService.getUsers()
        .then((users) => {
          if (!isMounted) return;

          // Map real Firestore users into MemberRecord
          const mapped: MemberRecord[] = users
            .filter((u) => u.role === "member" || !u.role) // Default unassigned to member role for safety
            .map((u) => {
              let joinedDate = "Recent";
            if (u.createdAt) {
              joinedDate = typeof u.createdAt === "string" && u.createdAt.includes("T")
                ? u.createdAt.split("T")[0]
                : String(u.createdAt);
            }

            return {
              id: u.uid,
              name: u.displayName || u.email?.split("@")[0] || "Athlete",
              email: u.email || "No email on file",
              tier: u.membershipId || (u.role === "admin" ? "Platform Admin" : u.role === "trainer" ? "Master Trainer" : "Pro Athlete"),
              status: (u.status as "active" | "suspended" | "past_due" | "inactive") || "active",
              joined: joinedDate,
              checkIns: 0,
            };
          });

          setMembers(mapped);
          setIsLoading(false);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("[IRONX AdminMembers] Error querying Firestore users:", err);
          setLoadError("Failed to synchronize athlete directory from cloud database.");
          setIsLoading(false);
        });
    } else {
      // Demo / Sandbox Mode: read seeded members from localStorage
      try {
        const saved = localStorage.getItem("ironyx-admin-members");
        setMembers(saved ? JSON.parse(saved) : DEMO_MEMBERS);
      } catch {
        setMembers(DEMO_MEMBERS);
      }
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isProductionAuth]);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.tier.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;

    const nextStatus: "active" | "suspended" = target.status === "active" ? "suspended" : "active";

    if (isProductionAuth) {
      setPendingActionId(id);
      try {
        // Persist status change to Firestore user document
        await FirestoreService.updateUserProfile(id, { status: nextStatus });

        // Update UI state ONLY after successful Firestore write
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
        );

        notify.success({
          title: "MEMBER STATUS UPDATED",
          message: `Athlete access pass for ${target.name} set to ${nextStatus.toUpperCase()} on cloud ledger.`,
        });
      } catch (err: unknown) {
        console.error("[IRONX AdminMembers] Error updating user status:", err);
        notify.error({
          title: "UPDATE FAILED",
          message: "Failed to persist member status change to cloud database. Verify administrative permissions.",
        });
      } finally {
        setPendingActionId(null);
      }
    } else {
      // Local Sandbox mode
      const updated = members.map((m) =>
        m.id === id ? { ...m, status: nextStatus } : m
      );
      setMembers(updated);
      try {
        localStorage.setItem("ironyx-admin-members", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage write failed", e);
      }
      notify.success({
        title: "MEMBER STATUS UPDATED",
        message: `Member access pass status updated to ${nextStatus.toUpperCase()} in local sandbox mode.`,
      });
    }
  };

  const activeCount = members.filter((m) => m.status === "active").length;
  const totalCheckIns = members.reduce((sum, m) => sum + m.checkIns, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">OPERATIONS • ATHLETE ROSTER</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Athlete Member Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Full facility roster audit, subscription tiers, and turnstile access control.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              {members.length} ENROLLED ATHLETES
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Telemetry Strip & Search Controls */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Total Athletes</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">{members.length}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Enrolled on ledger</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Active Passes</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{activeCount}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Turnstile cleared</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Suspended / Past Due</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-rose-400">{members.length - activeCount}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Requires settlement</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Total Check-Ins</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">{totalCheckIns}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Cumulative scans</p>
          </div>
        </div>
      </SectionReveal>

      {/* Search Bar */}
      <SectionReveal delay={0.08}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <label htmlFor="member-search" className="sr-only">Search athletes</label>
            <Input
              id="member-search"
              placeholder="Search by name, email, or tier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-[#71717a]" />}
              className="bg-[#0c0c10] border-[#1f1f26] text-white min-h-[44px]"
            />
          </div>

          <span className="text-xs font-mono text-[#71717a]">
            Displaying {filtered.length} of {members.length} members
          </span>
        </div>
      </SectionReveal>

      {/* Operational Member Ledger */}
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#dfff00] animate-spin mx-auto" aria-hidden="true" />
              <h3 className="text-sm font-bold text-white uppercase font-heading">Synchronizing Athlete Directory</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                Querying active user credentials and access passes from cloud database...
              </p>
            </div>
          ) : loadError ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                <XCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-heading">Directory Query Failed</h3>
              <p className="text-xs text-rose-400/80 max-w-sm mx-auto font-mono">
                {loadError}
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
                <Users className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-heading">No Enrolled Athletes</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                No member profiles were found on the cloud database ledger.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
                <Users className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-heading">No Matching Athletes</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                No member record matching "{search}" was located on the ledger.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop High-Density Table (Hidden on Mobile) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#08080a] text-[#71717a] uppercase border-b border-[#1f1f26]">
                    <tr>
                      <th scope="col" className="py-3.5 px-5">Athlete</th>
                      <th scope="col" className="py-3.5 px-5">Membership Tier</th>
                      <th scope="col" className="py-3.5 px-5">Enrolled Date</th>
                      <th scope="col" className="py-3.5 px-5">Check-Ins</th>
                      <th scope="col" className="py-3.5 px-5">Access Status</th>
                      <th scope="col" className="py-3.5 px-5 text-right">Access Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f26]">
                    {filtered.map((m) => {
                      const isActive = m.status === "active";
                      const isPending = pendingActionId === m.id;

                      return (
                        <tr key={m.id} className="hover:bg-[#121217] transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#121217] border border-[#1f1f26] flex items-center justify-center font-bold text-xs text-white shrink-0">
                                {m.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-white font-heading">{m.name}</div>
                                <div className="text-[11px] text-[#71717a]">{m.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <Badge variant="volt" className="text-[10px]">{m.tier}</Badge>
                          </td>
                          <td className="py-4 px-5 text-[#a1a1aa]">{m.joined}</td>
                          <td className="py-4 px-5 text-white font-bold">{m.checkIns} Scans</td>
                          <td className="py-4 px-5">
                            <Badge variant={isActive ? "success" : "destructive"} className="text-[10px] uppercase font-mono">
                              {isActive ? "ACTIVE PASS" : m.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Button
                              variant={isActive ? "ghost" : "volt"}
                              size="sm"
                              disabled={isPending}
                              isLoading={isPending}
                              onClick={() => toggleStatus(m.id)}
                              className="min-h-[40px] text-xs font-mono"
                              aria-label={`${isActive ? "Suspend pass for" : "Re-activate pass for"} ${m.name}`}
                            >
                              {isActive ? "Suspend Pass" : "Re-activate"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Stacked Record Cards (Visible < lg) */}
              <div className="lg:hidden divide-y divide-[#1f1f26]">
                {filtered.map((m) => {
                  const isActive = m.status === "active";
                  const isPending = pendingActionId === m.id;

                  return (
                    <div key={m.id} className="p-4 sm:p-5 space-y-4 hover:bg-[#121217] transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#08080a] border border-[#1f1f26] flex items-center justify-center font-bold text-sm text-white shrink-0">
                            {m.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-white font-heading">{m.name}</h3>
                            <p className="text-xs text-[#71717a] font-mono">{m.email}</p>
                          </div>
                        </div>
                        <Badge variant={isActive ? "success" : "destructive"} className="text-[10px] font-mono uppercase">
                          {isActive ? "ACTIVE" : m.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div className="bg-[#08080a] p-2 rounded-lg border border-[#1f1f26]">
                          <span className="text-[#71717a] block text-[9px] uppercase">Tier</span>
                          <span className="font-bold text-[#dfff00] truncate block">{m.tier}</span>
                        </div>
                        <div className="bg-[#08080a] p-2 rounded-lg border border-[#1f1f26]">
                          <span className="text-[#71717a] block text-[9px] uppercase">Joined</span>
                          <span className="text-white">{m.joined}</span>
                        </div>
                        <div className="bg-[#08080a] p-2 rounded-lg border border-[#1f1f26]">
                          <span className="text-[#71717a] block text-[9px] uppercase">Check-Ins</span>
                          <span className="font-bold text-white">{m.checkIns}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1f1f26]">
                        <Button
                          variant={isActive ? "secondary" : "volt"}
                          size="sm"
                          disabled={isPending}
                          isLoading={isPending}
                          onClick={() => toggleStatus(m.id)}
                          className="w-full min-h-[44px] text-xs font-mono"
                        >
                          {isActive ? "Suspend Access Pass" : "Re-activate Access Pass"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </SectionReveal>
    </div>
  );
}
