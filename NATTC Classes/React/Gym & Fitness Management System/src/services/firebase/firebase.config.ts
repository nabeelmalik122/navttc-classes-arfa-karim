import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Environment-based Firebase Configuration
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Determine if production Firebase credentials are provided
export const isFirebaseConfigured: boolean = Boolean(
  apiKey &&
  apiKey !== "AIzaSyMockKeyForIronyxFitnessSystem2026" &&
  projectId &&
  projectId !== "ironyx-fitness-saas"
);

const firebaseConfig = {
  apiKey: apiKey || "AIzaSyMockKeyForIronyxFitnessSystem2026",
  authDomain: authDomain || "ironyx-fitness-saas.firebaseapp.com",
  projectId: projectId || "ironyx-fitness-saas",
  storageBucket: storageBucket || "ironyx-fitness-saas.appspot.com",
  messagingSenderId: messagingSenderId || "1029384756",
  appId: appId || "1:1029384756:web:abcdef123456"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // In unconfigured state, log clear diagnostic information
    // Do NOT pretend mock data is live Firebase data.
    console.info(
      "[Ironyx Firebase Layer] Operating in Local Sandbox Mode. Live Firebase credentials not detected in .env. Supply VITE_FIREBASE_* variables to connect live production cluster."
    );
  }
} catch (error) {
  console.error("[Ironyx Firebase Layer] Error during Firebase client initialization:", error);
}

export { app, auth, db, storage };
