import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from './config';
import { AuthenticationError } from '@/core/errors/AppError';
import type { UserRole } from '@/core/types/user';

export interface DecodedCustomClaims {
  role?: UserRole;
  tenantId?: string;
  assignedLocationIds?: string[];
}

export class FirebaseAuthService {
  static async login(email: string, pass: string): Promise<User> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return cred.user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      throw new AuthenticationError(message, err);
    }
  }

  static async register(email: string, pass: string): Promise<User> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      return cred.user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      throw new AuthenticationError(message, err);
    }
  }

  static async logout(): Promise<void> {
    try {
      await fbSignOut(auth);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      throw new AuthenticationError(message, err);
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      throw new AuthenticationError(message, err);
    }
  }

  static async getCustomClaims(user: User): Promise<DecodedCustomClaims> {
    const tokenResult = await user.getIdTokenResult(true);
    return {
      role: tokenResult.claims.role as UserRole | undefined,
      tenantId: tokenResult.claims.tenantId as string | undefined,
      assignedLocationIds: tokenResult.claims.assignedLocationIds as string[] | undefined,
    };
  }

  static onAuthChange(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback);
  }
}
