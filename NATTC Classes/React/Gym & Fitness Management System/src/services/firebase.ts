import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Firebase configuration from environment or fallback placeholder
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForIronyxFitnessSystem2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ironyx-fitness-saas.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ironyx-fitness-saas",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ironyx-fitness-saas.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcdef123456"
};

// Initialize Firebase safely
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialized in mock/fallback mode:", error);
}

export { app, auth, db, storage };
