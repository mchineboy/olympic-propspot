import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { browser } from '$app/environment';

// Create a firebase config from the VITE_FIREBASE_* environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let firebaseInstance: { app: FirebaseApp; auth: Auth; db: Firestore } | null = null;

function initializeFirebase() {
  if (!browser) {
    return null;
  }

  if (firebaseInstance) {
    return firebaseInstance;
  }

  let app: FirebaseApp;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    // If you're also using Firestore emulator, uncomment the following line:
    // connectFirestoreEmulator(db, 'localhost', 8080);
  }

  firebaseInstance = { app, auth, db };
  return firebaseInstance;
}

export function getFirebase() {
  if (!browser) {
    console.log("Can't use Firebase on the server.");
    return null;
  }
  const instance = initializeFirebase();
  console.log("Firebase initialized:", instance ? "success" : "failed");
  return instance;
}

export function waitForAuth(): Promise<User | null> {
  const firebase = getFirebase();
  if (!firebase) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}