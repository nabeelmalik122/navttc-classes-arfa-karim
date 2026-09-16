import type { BaseEntity, ID, ISODateString } from './common';

export type ClassCategory = 'hiit' | 'strength' | 'boxing' | 'yoga' | 'crossfit' | 'recovery';

export type ClassIntensity = 'low' | 'moderate' | 'high' | 'extreme';

export type BookingStatus = 'confirmed' | 'waitlisted' | 'cancelled' | 'attended';

export interface GymClass extends BaseEntity {
  title: string;
  description: string;
  category: ClassCategory;
  intensity: ClassIntensity;
  durationMinutes: number;
  capacity: number;
  trainerId: ID;
  trainerName: string;
  coverImage?: string;
}

export interface ClassSession extends BaseEntity {
  classId: ID;
  title: string;
  category: ClassCategory;
  trainerId: ID;
  trainerName: string;
  startTime: ISODateString;
  endTime: ISODateString;
  capacity: number;
  enrolledCount: number;
  room: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}

export interface ClassBooking extends BaseEntity {
  sessionId: ID;
  classTitle: string;
  memberId: ID;
  memberName: string;
  startTime: ISODateString;
  status: BookingStatus;
  bookedAt: ISODateString;
}
