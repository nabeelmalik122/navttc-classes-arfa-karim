import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, QrCode, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Modal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useAuthStore } from "@/store/useAuthStore";
import { useGymStore } from "@/store/useGymStore";
import { notify } from "@/lib/notify";
import type { Booking } from "@/types";

export default function MemberBookingsPage() {
  const { user } = useAuthStore();
  const bookings = useGymStore((s) => s.bookings);
  const cancelBooking = useGymStore((s) => s.cancelBooking);
  const checkInBooking = useGymStore((s) => s.checkInBooking);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const userBookings = bookings.filter((b) => b.userId === user?.uid);

  const handleCancel = async (id: string, name: string) => {
    setActionId(id);
    try {
      await cancelBooking(id);
      notify.success({
        title: "SESSION CANCELLED",
        message: `The reservation for ${name} has been released.`,
      });
    } catch (err) {
      notify.error({
        title: "CANCELLATION FAILED",
        message: `Failed to cancel reservation for ${name}.`,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleSimulateCheckIn = async (b: Booking) => {
    setActionId(b.id);
    try {
      await checkInBooking(b.id);
      notify.success({
        title: "CHECK-IN VERIFIED",
        message: `Turnstile access granted for ${b.className}.`,
      });
      setSelectedBooking(null);
    } catch (err) {
      notify.error({
        title: "CHECK-IN FAILED",
        message: "Failed to complete check-in. Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Harmonized Header */}
      <SectionReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="volt" className="text-[10px] font-mono tracking-wider">SESSION RESERVATIONS</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight mt-1">
              My Arena Bookings
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              Present your Secure QR Entry Pass at turnstile or class check-in.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <Link to="/classes" className="block w-full sm:w-auto">
              <Button variant="volt" className="w-full sm:w-auto min-h-[44px] gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" /> Book New Session
              </Button>
            </Link>
          </div>
        </div>
      </SectionReveal>

      {/* Bookings Ledger */}
      <SectionReveal delay={0.05}>
        <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] overflow-hidden">
          {userBookings.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
                <Calendar className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase font-heading">No Active Reservations</h3>
                <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                  You currently have no scheduled training sessions on the arena ledger.
                </p>
              </div>
              <Link to="/classes" className="inline-block pt-2">
                <Button variant="volt" size="sm" className="min-h-[40px]">Browse Live Schedule</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#1f1f26]">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#121217]/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={b.status === "confirmed" ? "volt" : b.status === "attended" ? "success" : "destructive"}
                        className="text-[10px] font-mono font-bold uppercase"
                      >
                        {b.status}
                      </Badge>
                      <span className="text-xs text-[#71717a] font-mono">Code: {b.checkInCode}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white uppercase font-heading">
                      {b.className}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#a1a1aa] font-mono pt-0.5">
                      <span className="flex items-center gap-1.5 text-[#f4f4f5]">
                        <Clock className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" /> {b.bookingDate} @ {b.startTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#71717a]" aria-hidden="true" /> {b.room}
                      </span>
                      <span>Coach: <span className="text-[#f4f4f5]">{b.trainerName}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                    {b.status === "confirmed" && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="min-h-[40px] gap-1.5"
                          onClick={() => setSelectedBooking(b)}
                        >
                          <QrCode className="w-4 h-4 text-[#dfff00]" aria-hidden="true" /> Check-In Pass
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="min-h-[40px] text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-1.5"
                          onClick={() => handleCancel(b.id, b.className)}
                          isLoading={actionId === b.id}
                          disabled={actionId !== null}
                        >
                          <XCircle className="w-4 h-4" aria-hidden="true" /> Cancel
                        </Button>
                      </>
                    )}
                    {b.status === "attended" && (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Completed Session
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionReveal>

      {/* QR Code Check-In Pass Modal */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-sm text-center bg-[#0c0c10] border-[#1f1f26] text-[#f4f4f5]">
            <DialogHeader>
              <DialogTitle className="uppercase font-heading text-white">IRONX ENTRY PASS</DialogTitle>
              <DialogDescription className="font-mono text-xs text-[#dfff00]">
                {selectedBooking.className}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 flex flex-col items-center">
              {/* Simulated Secure QR Entry Pass */}
              <div className="p-4 bg-white rounded-2xl shadow-xl inline-block">
                <div className="w-48 h-48 bg-[#08080a] p-2 rounded-xl flex flex-col items-center justify-center space-y-2 border border-[#1f1f26]">
                  <QrCode className="w-32 h-32 text-[#dfff00]" aria-hidden="true" />
                  <span className="text-[11px] font-mono text-white font-bold tracking-widest">
                    {selectedBooking.checkInCode}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#a1a1aa] font-mono space-y-1">
                <p>Athlete: <span className="text-[#f4f4f5]">{user?.displayName || "Athlete"}</span></p>
                <p>Date: {selectedBooking.bookingDate} at {selectedBooking.startTime}</p>
                <p>Location: {selectedBooking.room}</p>
              </div>

              <Button
                variant="volt"
                className="w-full min-h-[44px]"
                onClick={() => handleSimulateCheckIn(selectedBooking)}
                isLoading={actionId === selectedBooking.id}
                disabled={actionId !== null}
              >
                {actionId === selectedBooking.id ? "Processing Scan..." : "Simulate Turnstile Scan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
