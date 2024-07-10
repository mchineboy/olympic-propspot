import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { browser } from '$app/environment';

const firebaseConfig = {
  apiKey: "AIzaSyBqG7CWbHWQCI4RObhqimebhhSPOmoFzIE",
  appId: "1:679905341367:web:f305b21e6463da00f8c232",
  authDomain: "ota-propspot.firebaseapp.com",
  projectId: "ota-propspot",
  // Add other necessary config properties here
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
    throw new Error("Can't use the Firebase client on the server.");
  }
  return initializeFirebase();
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