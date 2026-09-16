import { create } from 'zustand';
import type { WorkoutSet } from '@/core/types/workout';

interface WorkoutState {
  activeRoutineId: string | null;
  activeExerciseId: string | null;
  currentSets: WorkoutSet[];
  isTrackingLive: boolean;

  startWorkout: (routineId: string) => void;
  addSet: (set: WorkoutSet) => void;
  toggleSetCompleted: (setIndex: number) => void;
  endWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  activeRoutineId: null,
  activeExerciseId: null,
  currentSets: [],
  isTrackingLive: false,

  startWorkout: (routineId) => set({ activeRoutineId: routineId, isTrackingLive: true, currentSets: [] }),
  addSet: (newSet) => set((state) => ({ currentSets: [...state.currentSets, newSet] })),
  toggleSetCompleted: (index) => set((state) => ({
    currentSets: state.currentSets.map((s, i) => i === index ? { ...s, completed: !s.completed } : s),
  })),
  endWorkout: () => set({ activeRoutineId: null, activeExerciseId: null, currentSets: [], isTrackingLive: false }),
}));
