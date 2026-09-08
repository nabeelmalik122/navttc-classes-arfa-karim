import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
  type DocumentData
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase.config";
import type {
  UserProfile,
  FitnessClass,
  Booking,
  WorkoutRoutine,
  ProgressEntry,
  Trainer,
  MembershipPlan,
  Review
} from "@/types";

export class FirestoreService {
  /**
   * Fetch authenticated user's role and profile from the 'users' collection
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!isFirebaseConfigured || !db) {
      return null;
    }
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data() as UserProfile;
  }

  /**
   * Initialize or overwrite user document in 'users' collection
   */
  static async createUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      return;
    }
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, {
      ...profile,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  /**
   * Fetch all user profiles from 'users' collection for administrative auditing
   */
  static async getUsers(): Promise<UserProfile[]> {
    if (!isFirebaseConfigured || !db) return [];
    const colRef = collection(db, "users");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ ...d.data(), uid: d.id })) as unknown as UserProfile[];
  }

  /**
   * Update existing user profile in 'users' collection (e.g. status suspension by admin)
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Generic typed collection document fetcher
   */
  static async getCollectionData<T extends DocumentData>(collectionName: string): Promise<T[]> {
    if (!isFirebaseConfigured || !db) {
      return [];
    }
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as T[];
  }

  /**
   * Fetch arena fitness classes
   */
  static async getClasses(): Promise<FitnessClass[]> {
    return this.getCollectionData<FitnessClass>("classes");
  }

  /**
   * Create new arena fitness class
   */
  static async createClass(classData: FitnessClass): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "classes", classData.id);
    await setDoc(docRef, {
      ...classData,
      createdAt: serverTimestamp()
    });
  }

  /**
   * Update existing arena fitness class
   */
  static async updateClass(id: string, updates: Partial<FitnessClass>): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "classes", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Delete arena fitness class
   */
  static async deleteClass(id: string): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "classes", id);
    await deleteDoc(docRef);
  }

  /**
   * Fetch bookings ledger (optionally filtered by user)
   */
  static async getBookings(userId?: string): Promise<Booking[]> {
    if (!isFirebaseConfigured || !db) return [];
    const colRef = collection(db, "bookings");
    const q = userId ? query(colRef, where("userId", "==", userId)) : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as Booking[];
  }

  /**
   * Create new booking record
   */
  static async createBooking(booking: Booking): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "bookings", booking.id);
    await setDoc(docRef, {
      ...booking,
      createdAt: serverTimestamp()
    });
  }

  /**
   * Concurrency-safe atomic class booking with runTransaction.
   * Reads target class doc, validates capacity, creates booking doc, and updates bookedCount atomically.
   */
  static async bookClassAtomic(
    classId: string,
    bookingData: Omit<Booking, "id" | "bookedAt">
  ): Promise<{ booking: Booking; newBookedCount: number }> {
    if (!isFirebaseConfigured || !db) {
      throw new Error("FIREBASE_NOT_CONFIGURED");
    }

    const firestore = db;

    return await runTransaction(firestore, async (transaction) => {
      const classRef = doc(firestore, "classes", classId);
      const classSnap = await transaction.get(classRef);

      if (!classSnap.exists()) {
        throw new Error("CLASS_NOT_FOUND");
      }

      const classData = classSnap.data() as FitnessClass;
      const currentBookedCount = typeof classData.bookedCount === "number" ? classData.bookedCount : 0;
      const capacity = typeof classData.capacity === "number" ? classData.capacity : 20;

      if (currentBookedCount >= capacity) {
        throw new Error("CLASS_FULL");
      }

      // Generate collision-resistant unique document reference
      const bookingRef = doc(collection(firestore, "bookings"));
      const bookingId = bookingRef.id;

      const newBooking: Booking = {
        ...bookingData,
        id: bookingId,
        bookedAt: new Date().toISOString(),
      };

      // Set booking record inside transaction
      transaction.set(bookingRef, {
        ...newBooking,
        createdAt: serverTimestamp(),
      });

      // Atomically increment bookedCount and timestamp (matches firestore.rules affectedKeys)
      const nextBookedCount = currentBookedCount + 1;
      transaction.update(classRef, {
        bookedCount: nextBookedCount,
        updatedAt: serverTimestamp(),
      });

      return { booking: newBooking, newBookedCount: nextBookedCount };
    });
  }

  /**
   * Update booking status (attendance, cancellation)
   */
  static async updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Fetch workout routines
   */
  static async getWorkouts(): Promise<WorkoutRoutine[]> {
    return this.getCollectionData<WorkoutRoutine>("workouts");
  }

  /**
   * Create new workout routine
   */
  static async createWorkout(workout: WorkoutRoutine): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "workouts", workout.id);
    await setDoc(docRef, {
      ...workout,
      createdAt: serverTimestamp()
    });
  }

  /**
   * Update existing workout routine
   */
  static async updateWorkout(id: string, updates: Partial<WorkoutRoutine>): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "workouts", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Fetch biometric progression entries (optionally filtered by user)
   */
  static async getProgressEntries(userId?: string): Promise<ProgressEntry[]> {
    if (!isFirebaseConfigured || !db) return [];
    const colRef = collection(db, "progress");
    const q = userId ? query(colRef, where("userId", "==", userId)) : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as ProgressEntry[];
  }

  /**
   * Create new biometric progress entry
   */
  static async createProgressEntry(entry: ProgressEntry): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    const docRef = doc(db, "progress", entry.id);
    await setDoc(docRef, {
      ...entry,
      createdAt: serverTimestamp()
    });
  }

  /**
   * Fetch trainers directory
   */
  static async getTrainers(): Promise<Trainer[]> {
    return this.getCollectionData<Trainer>("trainers");
  }

  /**
   * Fetch membership plans
   */
  static async getPlans(): Promise<MembershipPlan[]> {
    return this.getCollectionData<MembershipPlan>("plans");
  }

  /**
   * Fetch reviews
   */
  static async getReviews(): Promise<Review[]> {
    return this.getCollectionData<Review>("reviews");
  }
}
