import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Flame, Calendar } from "lucide-react";
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
import { useAuthStore } from "@/store/useAuthStore";
import { notify } from "@/lib/notify";
import type { FitnessClass, ClassCategory } from "@/types";
import { isFirebaseConfigured } from "@/services/firebase/firebase.config";
import { MOCK_CLASSES } from "@/services/mockData";

const CATEGORIES: { label: string; value: ClassCategory | "all" }[] = [
  { label: "All Classes", value: "all" },
  { label: "Strength", value: "strength" },
  { label: "Boxing & Strike", value: "boxing" },
  { label: "HIIT & Turf", value: "hiit" },
  { label: "Mobility", value: "mobility" },
  { label: "Recovery", value: "recovery" },
];

export default function ClassesPage() {
  const isProduction = isFirebaseConfigured && import.meta.env.VITE_ENABLE_DEMO_AUTH !== "true";
  const storeClasses = useGymStore((s) => s.classes);
  const cleanClasses = (storeClasses || []).filter(
    (c) =>
      c &&
      c.title &&
      !c.title.toUpperCase().includes("SCHEDULE ENTRY BASED") &&
      !c.title.toUpperCase().includes("DETAILS YOU PROVIDED")
  );
  // IN PRODUCTION: Firestore is authoritative. Empty stays empty, 1 or 2 stays 1 or 2.
  const classes = isProduction ? cleanClasses : (cleanClasses.length >= 3 ? cleanClasses : MOCK_CLASSES);
  const bookClass = useGymStore((s) => s.bookClass);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<ClassCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<FitnessClass | null>(null);
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isBooking, setIsBooking] = useState(false);

  const filteredClasses = classes.filter((c) => {
    const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenBooking = (cls: FitnessClass) => {
    if (!isAuthenticated) {
      notify.info({
        title: "AUTHENTICATION REQUIRED",
        message: "Please sign in or use demo login to reserve a spot.",
      });
      navigate("/login");
      return;
    }
    setSelectedClass(cls);
  };

  const handleConfirmBooking = async () => {
    if (!selectedClass || !user || isBooking) return;

    setIsBooking(true);
    try {
      const result = await bookClass(
        selectedClass.id,
        user.uid,
        user.displayName || "Athlete",
        user.email,
        bookingDate
      );

      if (result.success) {
        notify.success({
          title: "SESSION RESERVED",
          message: result.message || "Your training slot has been locked in.",
        });
        setSelectedClass(null);
      } else {
        notify.error({
          title: "BOOKING NOT SAVED",
          message: result.message || "We couldn't complete your reservation. Please try again.",
        });
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {/* Harmonized Header */}
      <SectionReveal className="max-w-3xl space-y-4">
        <div>
          <Badge variant="volt" className="font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            LIVE MASTER SCHEDULE
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight font-heading leading-[1.08]">
          RESERVE YOUR ARENA SPOT.
        </h1>
        <p className="text-[#a1a1aa] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
          Small-group master coaching sessions with strictly enforced roster limits to guarantee personalized athletic coaching and equipment access.
        </p>
      </SectionReveal>

      {/* Harmonized Filter & Search Controls */}
      <SectionReveal delay={0.05}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-[#0c0c10] border border-[#1f1f26]">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none" role="tablist" aria-label="Class Categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                role="tab"
                aria-selected={selectedCategory === cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`h-10 px-4 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer min-h-[40px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] ${
                  selectedCategory === cat.value
                    ? "bg-[#dfff00] text-[#08080a] font-bold shadow-sm"
                    : "bg-[#121217] text-[#a1a1aa] hover:text-white border border-[#1f1f26] hover:border-[#2e2e38]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <Input
              aria-label="Search classes, coaches, or rooms"
              placeholder="Search class, coach, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" aria-hidden="true" />}
              className="bg-[#121217] border-[#1f1f26] focus:border-[#dfff00]"
            />
          </div>
        </div>
      </SectionReveal>

      {/* Class Cards Grid */}
      <SectionReveal delay={0.1}>
        {filteredClasses.length === 0 ? (
          <div className="rounded-2xl border border-[#1f1f26] bg-[#0c0c10] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#121217] border border-[#1f1f26] flex items-center justify-center text-[#71717a] mx-auto">
              <Calendar className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase font-heading">No Scheduled Sessions</h3>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
                There are currently no arena training classes matching your filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredClasses.map((item) => {
              const isFull = item.bookedCount >= item.capacity;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#1f1f26] bg-[#121217] overflow-hidden flex flex-col justify-between hover:border-[#2e2e38] transition-all duration-300 group"
                >
                  <div className="relative h-52 overflow-hidden bg-[#08080a]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <Badge variant="volt" className="font-mono text-[10px] uppercase">
                        {item.category}
                      </Badge>
                      <Badge variant="default" className="font-mono text-[10px] uppercase border-[#1f1f26] text-[#a1a1aa] bg-[#08080a]/80 backdrop-blur-sm">
                        {item.intensity}
                      </Badge>
                    </div>
                    {isFull && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="destructive" className="font-mono text-[10px] uppercase">
                          CAPACITY FULL
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#a1a1aa]">
                        <span className="text-[#dfff00] font-bold">{item.startTime}</span>
                        <span>{item.durationMinutes} MIN</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight font-heading break-words">
                        {item.title}
                      </h2>
                      <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#1f1f26]">
                      <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.trainerAvatar}
                            alt={item.trainerName}
                            className="w-6 h-6 rounded-full object-cover border border-[#1f1f26]"
                          />
                          <span className="text-[#f4f4f5] font-medium">{item.trainerName}</span>
                        </div>
                        <span className="flex items-center gap-1 font-mono text-[#a1a1aa]">
                          <Flame className="w-3.5 h-3.5 text-[#dfff00]" aria-hidden="true" /> ~{item.calorieBurnEstimate} kcal
                        </span>
                      </div>

                      {/* Booking Trigger Button */}
                      <Button
                        variant={isFull ? "secondary" : "volt"}
                        disabled={isFull}
                        fullWidth
                        className="min-h-[44px]"
                        onClick={() => handleOpenBooking(item)}
                      >
                        {isFull ? "Session at Capacity" : "Reserve Arena Spot"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionReveal>

      {/* Booking Confirmation Dialog Modal */}
      {selectedClass && (
        <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
          <DialogContent className="bg-[#0c0c10] border-[#1f1f26] text-[#f4f4f5] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white uppercase font-heading">Confirm Arena Session Reservation</DialogTitle>
              <DialogDescription className="text-[#a1a1aa]">
                Review the reservation details for your upcoming coaching session.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-[#08080a] border border-[#1f1f26] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white uppercase font-heading">
                    {selectedClass.title}
                  </span>
                  <Badge variant="volt" className="text-[10px] uppercase">{selectedClass.category}</Badge>
                </div>
                <p className="text-xs text-[#a1a1aa]">Lead Coach: <span className="text-[#f4f4f5] font-medium">{selectedClass.trainerName}</span></p>
                <p className="text-xs text-[#a1a1aa]">Location: <span className="text-[#f4f4f5] font-medium">{selectedClass.room}</span></p>
                <p className="text-xs text-[#dfff00] font-mono">Time: {selectedClass.startTime} ({selectedClass.durationMinutes} min)</p>
              </div>

              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase block mb-1.5" htmlFor="arena-booking-date">
                  Select Session Date:
                </label>
                <input
                  id="arena-booking-date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[#08080a] border border-[#1f1f26] rounded-xl px-4 py-2.5 text-sm text-[#f4f4f5] focus:outline-none focus:border-[#dfff00] transition-colors"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setSelectedClass(null)} disabled={isBooking}>
                Cancel
              </Button>
              <Button
                variant="volt"
                onClick={handleConfirmBooking}
                isLoading={isBooking}
                disabled={isBooking}
              >
                {isBooking ? "Confirming..." : "Confirm Reservation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
