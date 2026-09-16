import type { BaseEntity, ID } from './common';

export type UserRole = 'admin' | 'trainer' | 'member';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface UserProfile extends BaseEntity {
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  bio?: string;
}

export interface TrainerProfile extends UserProfile {
  role: 'trainer';
  specialties: string[];
  certifications: string[];
  experienceYears: number;
}

export interface MemberProfile extends UserProfile {
  role: 'member';
  membershipTier: string;
  membershipStatus: 'active' | 'expired' | 'trial';
  streakDays: number;
  totalCheckIns: number;
  assignedTrainerId?: ID;
}
