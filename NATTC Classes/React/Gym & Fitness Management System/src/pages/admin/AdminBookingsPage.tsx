import React, { useState } from "react";
import { BookOpen, Search, CheckCircle2, XCircle, Clock, Calendar, QrCode, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";

export default function AdminBookingsPage() {
  const bookings = useGymStore((s) => s.bookings);
  const checkInBooking = useGymStore((s) => s.checkInBooking);
  const [search, setSearch] = useState("");
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const handleVerifyEntry = async (id: string, userName: string) => {
    setCheckingInId(id);
    try {
      await checkInBooking(id);
      notify.success({
        title: "TURNSTILE ACCESS GRANTED",
        message: `Check-in verified for ${userName}.`,
      });
    } catch (err) {
      notify.error({
        title: "VERIFICATION FAILED",
        message: `Failed to verify entry for ${userName}.`,
      });
    } finally {
      setCheckingInId(null);
    }
  };

  const filtered = bookings.filter((b) =>
    b.userName.toLowerCase().includes(search.toLowerCase()) ||
    b.className.toLowerCase().includes(search.toLowerCase()) ||
    b.checkInCode.toLowerCase().includes(search.toLowerCase()) ||
    b.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const attendedCount = bookings.filter((b) => b.status === "attended").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contextual Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="destructive" className="text-[10px] font-mono tracking-wider">OPERATIONS • RESERVATIONS</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              Facility-Wide Booking Ledger
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono">
              Audit live session reservations, verify turnstile pass credentials, and audit capacity compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] font-mono border-[#1f1f26] text-[#a1a1aa]">
              {bookings.length} TOTAL SESSIONS
            </Badge>
          </div>
        </div>
      </SectionReveal>

      {/* Telemetry Summary Cards */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1 relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Total Bookings</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white relative z-10">{bookings.length}</div>
            <p className="text-[10px] text-[#71717a] font-mono relative z-10">Operational Demo Data</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Verified Scanned</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{attendedCount}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Turnstile admitted</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Awaiting Entry</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#dfff00]">{confirmedCount}</div>
            <p className="text-[10px] text-[#71717a] font-mono">Upcoming reservations</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#1f1f26] bg-[#0c0c10] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Turnstile Admittance</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white">
              {bookings.length > 0 ? Math.round((attendedCount / bookings.length) * 100) : 0}%
            </div>
            <p className="text-[10px] text-[#71717a] font-mono">Check-in compliance</p>
          </div>
        </div>
      </SectionReveal>

      {/* Search Bar */}
      <SectionReveal delay={0.08}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <label htmlFor="booking-search" className="sr-only">Search bookings</label>
            <Input
              id="booking-search"
              placeholder="Search code, athlete, or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-[#71717a]" />}
              className="bg-[#0c0c10] border-[#1f1f26] text-white min-h-[44px]"
            />
          </div>

          <span className="text-xs font-mono text-[#71717a]">
            Displaying {filtered.length} of {bookings.length} reservations
          </span>
        </div>
      </SectionReveal>

      {/* Reservation Ledger Table */}
      <SectionReveal delay={0.1}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-heading">No Matching Reservations</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                No booking record matching "{search}" was located on the ledger.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table (Hidden on Mobile) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#08080a] text-[#71717a] uppercase border-b border-[#1f1f26]">
                    <tr>
                      <th scope="col" className="py-3.5 px-5 whitespace-nowrap">Pass Code</th>
                      <th scope="col" className="py-3.5 px-5">Athlete</th>
                      <th scope="col" className="py-3.5 px-5">Master Class</th>
                      <th scope="col" className="py-3.5 px-5 whitespace-nowrap">Date & Time</th>
                      <th scope="col" className="py-3.5 px-5">Room</th>
                      <th scope="col" className="py-3.5 px-5">Status</th>
                      <th scope="col" className="py-3.5 px-5 text-right whitespace-nowrap">Turnstile Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f26]">
                    {filtered.map((b) => {
                      const isAttended = b.status === "attended";
                      return (
                        <tr key={b.id} className="hover:bg-[#121217] transition-colors">
                          <td className="py-4 px-5 whitespace-nowrap">
                            <span className="inline-block font-bold text-[#dfff00] bg-[#08080a] px-2.5 py-1 rounded border border-[#1f1f26] font-mono text-xs whitespace-nowrap tracking-wider">
                              {b.checkInCode}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="font-bold text-white font-heading text-sm whitespace-nowrap">{b.userName}</div>
                            <div className="text-[11px] text-[#71717a] truncate max-w-[200px]">{b.userEmail}</div>
                          </td>
                          <td className="py-4 px-5 font-bold text-white uppercase">{b.className}</td>
                          <td className="py-4 px-5 text-[#a1a1aa] whitespace-nowrap">
                            {b.bookingDate} • {b.startTime}
                          </td>
                          <td className="py-4 px-5 text-[#71717a] whitespace-nowrap">{b.room}</td>
                          <td className="py-4 px-5 whitespace-nowrap">
                            <Badge
                              variant={isAttended ? "success" : b.status === "confirmed" ? "volt" : "destructive"}
                              className="text-[10px] font-mono uppercase whitespace-nowrap"
                            >
                              {isAttended ? "ATTENDED" : b.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            {!isAttended ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleVerifyEntry(b.id, b.userName)}
                                isLoading={checkingInId === b.id}
                                disabled={checkingInId !== null}
                                className="min-h-[38px] px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38] gap-1.5 whitespace-nowrap inline-flex items-center ml-auto"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#dfff00] shrink-0" aria-hidden="true" />
                                <span>{checkingInId === b.id ? "Verifying..." : "Verify Entry"}</span>
                              </Button>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#71717a] py-1 px-2.5 rounded bg-[#08080a] border border-[#1f1f26]/60">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                                <span>Admitted</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Stacked Records (Visible < lg) */}
              <div className="lg:hidden divide-y divide-[#1f1f26]">
                {filtered.map((b) => {
                  const isAttended = b.status === "attended";
                  return (
                    <div key={b.id} className="p-4 sm:p-5 space-y-3 hover:bg-[#121217] transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-bold text-xs text-[#dfff00] font-mono bg-[#08080a] px-2 py-0.5 rounded border border-[#1f1f26]">
                            PASS: {b.checkInCode}
                          </span>
                          <h3 className="font-bold text-base text-white font-heading mt-1.5">{b.className}</h3>
                          <p className="text-xs text-[#71717a] font-mono">{b.userName} • {b.userEmail}</p>
                        </div>
                        <Badge
                          variant={isAttended ? "success" : b.status === "confirmed" ? "volt" : "destructive"}
                          className="text-[10px] font-mono uppercase"
                        >
                          {isAttended ? "ATTENDED" : b.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-[#a1a1aa] pt-1">
                        <span>{b.bookingDate} @ {b.startTime}</span>
                        <span>{b.room}</span>
                      </div>

                      {!isAttended && (
                        <div className="pt-2 border-t border-[#1f1f26]">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleVerifyEntry(b.id, b.userName)}
                            isLoading={checkingInId === b.id}
                            disabled={checkingInId !== null}
                            className="w-full min-h-[44px] text-xs font-mono bg-[#121217] border-[#1f1f26] text-white hover:bg-[#16161b] hover:border-[#2e2e38] gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#dfff00]" aria-hidden="true" />
                            {checkingInId === b.id ? "Verifying..." : "Verify Turnstile Entry"}
                          </Button>
                        </div>
                      )}
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
