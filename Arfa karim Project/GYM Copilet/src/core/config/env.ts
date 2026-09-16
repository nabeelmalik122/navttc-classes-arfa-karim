export interface AppEnvironment {
  appName: string;
  appEnv: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  stripe: {
    publishableKey: string;
  };
}

export const env: AppEnvironment = {
  appName: import.meta.env.VITE_APP_NAME || 'GymOS Enterprise',
  appEnv: (import.meta.env.VITE_APP_ENV as AppEnvironment['appEnv']) || 'development',
  apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5001',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },
};
