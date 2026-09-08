import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase.config";
import type { UserProfile, UserRole } from "@/types";

export class AuthService {
  /**
   * Listen to active Firebase authentication identity stream
   */
  static subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
    if (!isFirebaseConfigured || !auth) {
      // In sandbox mode, no background subscription needed
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Authenticate user with email and password
   */
  static async login(email: string, password: string): Promise<FirebaseUser | null> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("LIVE_FIREBASE_NOT_CONFIGURED");
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  /**
   * Register new user account with email and password
   */
  static async register(email: string, password: string): Promise<FirebaseUser | null> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("LIVE_FIREBASE_NOT_CONFIGURED");
    }
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  /**
   * Sign in using Google OAuth Provider
   */
  static async loginWithGoogle(): Promise<FirebaseUser | null> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("LIVE_FIREBASE_NOT_CONFIGURED");
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }

  /**
   * Send password recovery email
   */
  static async sendPasswordReset(email: string): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("LIVE_FIREBASE_NOT_CONFIGURED");
    }
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Alias for sendPasswordReset
   */
  static async resetPassword(email: string): Promise<void> {
    return this.sendPasswordReset(email);
  }

  /**
   * Confirm password recovery and set new password with Firebase oobCode
   */
  static async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("LIVE_FIREBASE_NOT_CONFIGURED");
    }
    await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
  }

  /**
   * End session
   */
  static async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
  }
}
