import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * VORTEX CLIENT CACHE & REACTIVE STORE
 * 
 * ARCHITECTURAL NOTICE:
 * Zustand local client state provides optimistic UI responsiveness and local caching.
 * When production Firebase is configured, operations are written to and synced with Firestore.
 * In local sandbox mode, local state with persistence provides isolated development capabilities.
 */
import type {
  FitnessClass,
  Booking,
  WorkoutRoutine,
  ProgressEntry,
  AppNotification,
  MembershipPlan,
  Trainer,
  Review
} from '@/types';
import {
  MOCK_CLASSES,
  MOCK_BOOKINGS,
  MOCK_WORKOUTS,
  MOCK_PROGRESS,
  MOCK_NOTIFICATIONS,
  MOCK_PLANS,
  MOCK_TRAINERS,
  MOCK_REVIEWS
} from '@/services/mockData';
import { isFirebaseConfigured } from '@/services/firebase/firebase.config';
import { FirestoreService } from '@/services/firebase/firestore.service';

interface GymState {
  classes: FitnessClass[];
  bookings: Booking[];
  workouts: WorkoutRoutine[];
  progress: ProgressEntry[];
  notifications: AppNotification[];
  plans: MembershipPlan[];
  trainers: Trainer[];
  reviews: Review[];

  // Sync / Loading Metadata
  isLoadingData: boolean;
  dataError: string | null;
  syncWithFirestore: () => Promise<void>;

  // Actions: Bookings
  bookClass: (classId: string, userId: string, userName: string, userEmail: string, date: string) => Promise<{ success: boolean; message: string; booking?: Booking }>;
  cancelBooking: (bookingId: string) => Promise<void>;
  checkInBooking: (bookingId: string) => Promise<void>;

  // Actions: Classes (Admin/Trainer)
  addClass: (newClass: Omit<FitnessClass, 'id' | 'bookedCount'>) => Promise<void>;
  updateClass: (id: string, updates: Partial<FitnessClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  // Actions: Workouts
  addWorkout: (workout: Omit<WorkoutRoutine, 'id'>) => Promise<void>;
  updateWorkout: (id: string, updates: Partial<WorkoutRoutine>) => Promise<void>;

  // Actions: Progress Tracking
  addProgressEntry: (entry: Omit<ProgressEntry, 'id'>) => Promise<void>;

  // Actions: Reviews
  toggleReviewApproval: (id: string) => void;

  // Actions: Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
}

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      classes: MOCK_CLASSES,
      bookings: MOCK_BOOKINGS,
      workouts: MOCK_WORKOUTS,
      progress: MOCK_PROGRESS,
      notifications: MOCK_NOTIFICATIONS,
      plans: MOCK_PLANS,
      trainers: MOCK_TRAINERS,
      reviews: MOCK_REVIEWS,

      isLoadingData: false,
      dataError: null,

      syncWithFirestore: async () => {
        if (!isFirebaseConfigured || get().isLoadingData) return;

        const isProductionAuth = isFirebaseConfigured && import.meta.env.VITE_ENABLE_DEMO_AUTH !== "true";

        set({ isLoadingData: true, dataError: null });
        try {
          const [fbClasses, fbBookings, fbWorkouts, fbProgress, fbTrainers, fbPlans, fbReviews] =
            await Promise.all([
              FirestoreService.getClasses(),
              FirestoreService.getBookings(),
              FirestoreService.getWorkouts(),
              FirestoreService.getProgressEntries(),
              FirestoreService.getTrainers(),
              FirestoreService.getPlans(),
              FirestoreService.getReviews()
            ]);

          const sanitizedClasses = (fbClasses || []).filter(
            (c) =>
              c.title &&
              !c.title.toUpperCase().includes("SCHEDULE ENTRY BASED") &&
              !c.title.toUpperCase().includes("DETAILS YOU PROVIDED")
          );

          set({
            // IN PRODUCTION: Firestore is authoritative. Empty collection produces empty list.
            // 1 or 2 classes stay 1 or 2 classes. Never inject mock classes in production.
            classes: isProductionAuth
              ? sanitizedClasses
              : (sanitizedClasses.length >= 3 ? sanitizedClasses : MOCK_CLASSES),
            bookings: (fbBookings && fbBookings.length > 0) ? fbBookings : (isProductionAuth ? [] : MOCK_BOOKINGS),
            workouts: (fbWorkouts && fbWorkouts.length > 0) ? fbWorkouts : (isProductionAuth ? [] : MOCK_WORKOUTS),
            progress: (fbProgress && fbProgress.length > 0) ? fbProgress : (isProductionAuth ? [] : MOCK_PROGRESS),
            trainers: (fbTrainers && fbTrainers.length >= 3) ? fbTrainers : MOCK_TRAINERS,
            plans: (fbPlans && fbPlans.length >= 3) ? fbPlans : MOCK_PLANS,
            reviews: (fbReviews && fbReviews.length >= 3) ? fbReviews : MOCK_REVIEWS,
            isLoadingData: false,
            dataError: null
          });
        } catch (err: unknown) {
          console.error("[IRONX GymStore] Error syncing with Firestore:", err);
          if (isProductionAuth) {
            set({
              isLoadingData: false,
              dataError: "Unable to sync latest records from cloud database. Showing current ledger."
            });
          } else {
            set({
              classes: MOCK_CLASSES,
              trainers: MOCK_TRAINERS,
              plans: MOCK_PLANS,
              reviews: MOCK_REVIEWS,
              isLoadingData: false,
              dataError: "Unable to sync latest records from cloud database. Showing local cache."
            });
          }
        }
      },

      bookClass: async (classId, userId, userName, userEmail, date) => {
        const state = get();
        const targetClass = state.classes.find((c) => c.id === classId);

        if (!targetClass) {
          return { success: false, message: "Class session not found on active ledger" };
        }

        // Fast local pre-check (avoids unnecessary roundtrips if locally known to be full)
        if (targetClass.bookedCount >= targetClass.capacity) {
          return { success: false, message: "Class is currently at maximum athlete capacity" };
        }

        // Prevent duplicate booking for same user, class, and date
        const existingBooking = state.bookings.find(
          (b) => b.classId === classId && b.userId === userId && b.bookingDate === date && b.status === 'confirmed'
        );

        if (existingBooking) {
          return { success: false, message: "You already hold an active reservation for this session" };
        }

        const baseBookingData = {
          classId: targetClass.id,
          className: targetClass.title,
          classCategory: targetClass.category,
          trainerName: targetClass.trainerName,
          userId,
          userName,
          userEmail,
          bookingDate: date,
          startTime: targetClass.startTime,
          room: targetClass.room,
          status: 'confirmed' as const,
          checkInCode: `IRX-${Math.floor(1000 + Math.random() * 9000)}`
        };

        if (isFirebaseConfigured) {
          try {
            // ATOMIC TRANSACTION: Reads class document, checks capacity, creates booking, and increments bookedCount atomically
            const { booking: newBooking, newBookedCount } = await FirestoreService.bookClassAtomic(
              classId,
              baseBookingData
            );

            const updatedClasses = state.classes.map((c) =>
              c.id === classId ? { ...c, bookedCount: newBookedCount } : c
            );

            const confirmationNotif: AppNotification = {
              id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              userId,
              title: `Confirmed: ${targetClass.title}`,
              message: `Your reservation is set for ${date} at ${targetClass.startTime} in ${targetClass.room}.`,
              type: 'booking',
              link: '/member/bookings',
              read: false,
              createdAt: new Date().toISOString()
            };

            set({
              bookings: [newBooking, ...state.bookings],
              classes: updatedClasses,
              notifications: [confirmationNotif, ...state.notifications]
            });

            return { success: true, message: "Class spot successfully reserved!", booking: newBooking };
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error("[IRONX GymStore] Atomic booking transaction error:", err);

            if (errorMessage === "CLASS_FULL") {
              // Update local state to reflect that the class has reached capacity
              set({
                classes: state.classes.map((c) =>
                  c.id === classId ? { ...c, bookedCount: c.capacity } : c
                )
              });
              return { success: false, message: "This session reached maximum athlete capacity just now. Reservation rejected." };
            }

            if (errorMessage === "CLASS_NOT_FOUND") {
              return { success: false, message: "This class session is no longer available on the ledger." };
            }

            return { success: false, message: "Booking transaction failed. Concurrency conflict or network error. Please retry." };
          }
        }

        // Offline Sandbox Fallback (Only active in local demo sandbox mode)
        const sandboxBooking: Booking = {
          ...baseBookingData,
          id: `bk_${Date.now()}`,
          bookedAt: new Date().toISOString()
        };

        const updatedClasses = state.classes.map((c) =>
          c.id === classId ? { ...c, bookedCount: c.bookedCount + 1 } : c
        );

        set({
          bookings: [sandboxBooking, ...state.bookings],
          classes: updatedClasses
        });

        return { success: true, message: "Class spot successfully reserved in sandbox mode!", booking: sandboxBooking };
      },

      cancelBooking: async (bookingId: string) => {
        const state = get();
        const booking = state.bookings.find((b) => b.id === bookingId);
        if (!booking) return;

        const updatedBookings = state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
        );

        const targetClass = state.classes.find((c) => c.id === booking.classId);
        const updatedClasses = state.classes.map((c) =>
          c.id === booking.classId ? { ...c, bookedCount: Math.max(0, c.bookedCount - 1) } : c
        );

        if (isFirebaseConfigured) {
          await FirestoreService.updateBooking(bookingId, { status: 'cancelled' });
          if (targetClass) {
            await FirestoreService.updateClass(booking.classId, { bookedCount: Math.max(0, targetClass.bookedCount - 1) });
          }
        }

        set({
          bookings: updatedBookings,
          classes: updatedClasses
        });
      },

      checkInBooking: async (bookingId: string) => {
        const state = get();
        const now = new Date().toISOString();
        const updatedBookings = state.bookings.map((b) =>
          b.id === bookingId
            ? { ...b, status: 'attended' as const, checkedInAt: now }
            : b
        );

        if (isFirebaseConfigured) {
          await FirestoreService.updateBooking(bookingId, { status: 'attended', checkedInAt: now });
        }

        set({ bookings: updatedBookings });
      },

      addClass: async (newClassData) => {
        const newClass: FitnessClass = {
          ...newClassData,
          id: `cls_${Date.now()}`,
          bookedCount: 0
        };

        if (isFirebaseConfigured) {
          await FirestoreService.createClass(newClass);
        }

        set((state) => ({ classes: [newClass, ...state.classes] }));
      },

      updateClass: async (id, updates) => {
        if (isFirebaseConfigured) {
          await FirestoreService.updateClass(id, updates);
        }

        set((state) => ({
          classes: state.classes.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }));
      },

      deleteClass: async (id) => {
        if (isFirebaseConfigured) {
          await FirestoreService.deleteClass(id);
        }

        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id)
        }));
      },

      addWorkout: async (workoutData) => {
        const newWorkout: WorkoutRoutine = {
          ...workoutData,
          id: `wo_${Date.now()}`
        };

        if (isFirebaseConfigured) {
          await FirestoreService.createWorkout(newWorkout);
        }

        set((state) => ({ workouts: [newWorkout, ...state.workouts] }));
      },

      updateWorkout: async (id, updates) => {
        if (isFirebaseConfigured) {
          await FirestoreService.updateWorkout(id, updates);
        }

        set((state) => ({
          workouts: state.workouts.map((w) => (w.id === id ? { ...w, ...updates } : w))
        }));
      },

      addProgressEntry: async (entryData) => {
        const newEntry: ProgressEntry = {
          ...entryData,
          id: `prg_${Date.now()}`
        };

        if (isFirebaseConfigured) {
          await FirestoreService.createProgressEntry(newEntry);
        }

        set((state) => ({ progress: [...state.progress, newEntry] }));
      },

      toggleReviewApproval: (id) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, isApproved: !r.isApproved } : r
          )
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }));
      },

      addNotification: (notifData) => {
        const newNotif: AppNotification = {
          ...notifData,
          id: `notif_${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: false
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      }
    }),
    {
      name: 'ironyx-gym-storage'
    }
  )
);
