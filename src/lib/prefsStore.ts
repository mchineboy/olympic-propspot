import { writable } from "svelte/store";
import { doc, getDoc, setDoc, onSnapshot, type DocumentData } from "firebase/firestore";
import { getFirebase } from "./firebase.client";

export interface UserPreferences extends DocumentData {
    uid: string;
    defaultPropType: string;
    // Add other preference fields here as needed
}

function prefsStore() {
    const { subscribe, set } = writable<UserPreferences | null>(null);

    return {
        subscribe,
        getUserPrefs: async (userId: string): Promise<UserPreferences | null> => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return null;
            }
            const docRef = doc(firebase.db, 'prefs', userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { uid: docSnap.id, ...docSnap.data() } as UserPreferences;
            } else {
                return null;
            }
        },
        setUserPrefs: async (userId: string, prefs: Partial<UserPreferences>): Promise<void> => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return;
            }
            const docRef = doc(firebase.db, 'prefs', userId);
            await setDoc(docRef, prefs, { merge: true });
        },
        init: (userId: string) => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return;
            }
            const unsubscribe = onSnapshot(doc(firebase.db, "prefs", userId), (doc) => {
                if (doc.exists()) {
                    set({ uid: doc.id, ...doc.data() } as UserPreferences);
                } else {
                    set(null);
                }
            });
            return unsubscribe;
        },
    };
}

export const prefs = prefsStore();