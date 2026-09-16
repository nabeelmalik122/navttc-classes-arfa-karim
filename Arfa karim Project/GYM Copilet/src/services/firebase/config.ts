import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { env } from '@/core/config/env';

// Initialize Firebase App idempotently
export const firebaseApp = !getApps().length
  ? initializeApp(env.firebase)
  : getApp();

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
