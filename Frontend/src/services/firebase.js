// --- 1. IMPORT FIREBASE LIBRARIES ---
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// --- 2. YOUR WEB APP'S FIREBASE CONFIGURATION ---
// The configuration is loaded securely from environment variables.
// This allows the app to use different Firebase projects for development and production
// without changing the code.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// --- 3. INITIALIZE FIREBASE APP ---
// This line sets up the connection to your Firebase project.
const app = initializeApp(firebaseConfig);

// --- 4. INITIALIZE AND EXPORT FIREBASE SERVICES ---
// Export 'auth' to be used throughout the application for signing in, etc.
export const auth = getAuth(app);

// Example for other services:
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);