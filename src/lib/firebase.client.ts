import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { browser } from '$app/environment';

export let db: Firestore;
export let app: FirebaseApp;
export let auth: Auth;

const firebaseConfig = {
	apiKey: "AIzaSyBqG7CWbHWQCI4RObhqimebhhSPOmoFzIE",
	aappId: "1:679905341367:web:f305b21e6463da00f8c232",
	useEmulator: import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'false',
	authDomain: "ota-propspot.firebaseapp.com",
};

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);

		if (firebaseConfig.useEmulator) {
			connectAuthEmulator(auth, 'http://127.0.0.1:9099');
		}
	}
};
