// ==========================================
// USER & ROLE TYPES
// ==========================================
export type UserRole = 'member' | 'trainer' | 'admin' | 'guest';

export type IronxPlanId = 'plan_foundation' | 'plan_pro' | 'plan_titan_all_access';

export type IronxAccessState = 'active' | 'grace' | 'restricted' | 'canceled' | 'none';

export interface IronxAccessPolicy {
  subscriptionRequired: boolean;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled' | 'none';
  planId: IronxPlanId | null;
  accessState: IronxAccessState;
  effectiveUntil: string | null;
  updatedAt: string;
}

export interface UserSubscription {
  provider: 'PADDLE';
  paddleCustomerId: string;
  paddleSubscriptionId: string;
  paddlePriceId: string;
  planId: IronxPlanId;
  status: 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled';
  currentBillingPeriodStart: string | null;
  currentBillingPeriodEnd: string | null;
  scheduledChange: {
    action: string;
    effectiveAt: string | null;
  } | null;
  currency: string;
  unitPrice: number;
  lastEventId: string;
  lastEventOccurredAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  membershipId?: string;
  paddleCustomerId?: string;
  paddleSubscriptionId?: string;
  subscription?: UserSubscription;
  accessPolicy?: IronxAccessPolicy;
  createdAt: string; // ISO string
  updatedAt: string;
  metadata?: {
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    dob?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relation: string;
    };
    fitnessGoal?: string;
    heightCm?: number;
    weightKg?: number;
  };
}

// ==========================================
// MEMBERSHIP PLAN & SUBSCRIPTION
// ==========================================
export type MembershipTier = 'starter' | 'pro' | 'titan-all-access' | 'vip-private';

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  tier: MembershipTier;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  isFeatured: boolean;
  classCreditsPerMonth: number; // -1 for unlimited
  guestPassesPerMonth: number;
  saunaAndRecoveryAccess: boolean;
  personalTrainerSessions: number;
  status: 'published' | 'draft' | 'archived';
}

export interface UserMembership {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  billingCycle: 'monthly' | 'annual';
  startDate: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  totalPaid: number;
  remainingCredits: number;
}

// ==========================================
// TRAINER TYPES
// ==========================================
export interface Trainer {
  id: string;
  userId: string;
  fullName: string;
  slug: string;
  title: string;
  bio: string;
  specialties: string[];
  experienceYears: number;
  certifications: string[];
  avatarUrl: string;
  coverUrl?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  weeklyAvailableHours: number;
}

// ==========================================
// CLASSES & BOOKINGS
// ==========================================
export type ClassCategory = 'strength' | 'hiit' | 'mobility' | 'boxing' | 'cycling' | 'recovery' | 'crossfit';
export type ClassIntensity = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

export interface FitnessClass {
  id: string;
  title: string;
  description: string;
  category: ClassCategory;
  intensity: ClassIntensity;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  durationMinutes: number;
  capacity: number;
  bookedCount: number;
  room: string;
  scheduleDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string; // "07:00"
  imageUrl: string;
  calorieBurnEstimate: number;
  status: 'active' | 'cancelled' | 'full';
}

export type BookingStatus = 'confirmed' | 'attended' | 'cancelled' | 'no-show';

export interface Booking {
  id: string;
  classId: string;
  className: string;
  classCategory: ClassCategory;
  trainerName: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookingDate: string; // "YYYY-MM-DD"
  startTime: string; // "08:00 AM"
  room: string;
  status: BookingStatus;
  bookedAt: string;
  checkedInAt?: string;
  checkInCode: string;
}

// ==========================================
// WORKOUTS & EXERCISES
// ==========================================
export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight';
  sets: number;
  reps: string;
  targetRPE?: number;
  restSeconds: number;
  notes?: string;
  videoThumbnail?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'elite';
  targetMuscleGroup: string[];
  estimatedDurationMinutes: number;
  createdBy: string;
  trainerName?: string;
  assignedToUserIds: string[];
  exercises: Exercise[];
  tags: string[];
}

// ==========================================
// PROGRESS & METRICS
// ==========================================
export interface ProgressEntry {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  benchPressMaxKg?: number;
  squatMaxKg?: number;
  deadliftMaxKg?: number;
  notes?: string;
}

// ==========================================
// NOTIFICATIONS & REVIEWS
// ==========================================
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'membership' | 'workout' | 'system' | 'trainer';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  category: 'facility' | 'trainer' | 'class' | 'overall';
  isApproved: boolean;
  createdAt: string;
}

// ==========================================
// GALLERY TYPES
// ==========================================
export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'iron' | 'recovery' | 'combat' | 'turf';
  imageUrl: string;
  createdAt?: string;
}

// ==========================================
// CANONICAL TYPE ALIASES
// ==========================================
export type User = UserProfile;
export type Membership = UserMembership;
export type Workout = WorkoutRoutine;
export type ProgressRecord = ProgressEntry;
export type Notification = AppNotification;

