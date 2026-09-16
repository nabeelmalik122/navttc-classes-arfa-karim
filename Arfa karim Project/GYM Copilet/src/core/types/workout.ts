import type { BaseEntity, ID, ISODateString } from './common';

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'quadriceps' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'core' 
  | 'full_body';

export interface ExerciseItem extends BaseEntity {
  tenantId: ID;
  name: string;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups: MuscleGroup[];
  equipment: string;
  videoUrl?: string;
  instructions: string[];
  thumbnailUrl?: string;
}

export interface WorkoutSet {
  setNumber: number;
  weightKg?: number;
  reps?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restSeconds?: number;
  isWarmup?: boolean;
  completed: boolean;
}

export interface WorkoutExercisePlan {
  exerciseId: ID;
  targetSets: number;
  targetReps: string; // e.g. "8-12"
  restPeriodSeconds: number;
  notes?: string;
}

export interface WorkoutRoutine extends BaseEntity {
  tenantId: ID;
  trainerId?: ID;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  estimatedDurationMinutes: number;
  exercises: WorkoutExercisePlan[];
  isPublicTemplate: boolean;
}

export interface WorkoutExecutionLog extends BaseEntity {
  tenantId: ID;
  memberId: ID;
  routineId?: ID;
  startTime: ISODateString;
  endTime: ISODateString;
  totalVolumeKg: number;
  completedSets: {
    exerciseId: ID;
    sets: WorkoutSet[];
  }[];
  notes?: string;
  userRating?: 1 | 2 | 3 | 4 | 5;
}
