import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { browser } from '$app/environment';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const firebaseConfig = {
  apiKey: "AIzaSyBqG7CWbHWQCI4RObhqimebhhSPOmoFzIE",
  appId: "1:679905341367:web:f305b21e6463da00f8c232",
  authDomain: "ota-propspot.firebaseapp.com",
  // Add other necessary config properties here
};

function initializeFirebase() {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.");
  }
  
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099');
      // If you're also using Firestore emulator, uncomment the following line:
      // connectFirestoreEmulator(db, 'localhost', 8080);
    }
  }

  return { app, auth, db };
}

export { initializeFirebase, app, auth, db };