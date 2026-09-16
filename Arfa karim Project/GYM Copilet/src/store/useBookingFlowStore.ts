import { create } from 'zustand';
import type { ClassSession } from '@/core/types/class';

export type BookingStep = 'select_session' | 'confirm_details' | 'process_payment' | 'completed';

interface BookingFlowState {
  currentStep: BookingStep;
  selectedSession: ClassSession | null;
  waiverAccepted: boolean;
  notes: string;

  // Actions
  setStep: (step: BookingStep) => void;
  setSelectedSession: (session: ClassSession | null) => void;
  setWaiverAccepted: (accepted: boolean) => void;
  setNotes: (notes: string) => void;
  resetFlow: () => void;
}

export const useBookingFlowStore = create<BookingFlowState>((set) => ({
  currentStep: 'select_session',
  selectedSession: null,
  waiverAccepted: false,
  notes: '',

  setStep: (currentStep) => set({ currentStep }),
  setSelectedSession: (selectedSession) => set({ selectedSession }),
  setWaiverAccepted: (waiverAccepted) => set({ waiverAccepted }),
  setNotes: (notes) => set({ notes }),
  resetFlow: () => set({
    currentStep: 'select_session',
    selectedSession: null,
    waiverAccepted: false,
    notes: '',
  }),
}));
