// src/lib/firebase.ts

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyBqG7CWbHWQCI4RObhqimebhhSPOmoFzIE",
    authDomain: "ota-propspot.firebaseapp.com",
    projectId: "ota-propspot",
    storageBucket: "ota-propspot.appspot.com",
    messagingSenderId: "679905341367",
    appId: "1:679905341367:web:f305b21e6463da00f8c232",
    measurementId: "G-VBX5DKXD72"
  };

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
// let analytics: Analytics;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);
    // analytics = getAnalytics(firebaseApp);
}

export { firebaseApp, firestore, auth, storage };