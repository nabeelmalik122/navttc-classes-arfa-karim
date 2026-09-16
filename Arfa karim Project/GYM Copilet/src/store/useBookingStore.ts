import { create } from 'zustand';
import type { ClassSession } from '@/core/types/class';

interface BookingState {
  selectedSession: ClassSession | null;
  isBookingModalOpen: boolean;

  setSelectedSession: (session: ClassSession | null) => void;
  openBookingModal: (session: ClassSession) => void;
  closeBookingModal: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedSession: null,
  isBookingModalOpen: false,

  setSelectedSession: (selectedSession) => set({ selectedSession }),
  openBookingModal: (session) => set({ selectedSession: session, isBookingModalOpen: true }),
  closeBookingModal: () => set({ selectedSession: null, isBookingModalOpen: false }),
}));
