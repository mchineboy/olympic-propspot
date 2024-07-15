import { writable } from "svelte/store";
import { onSnapshot, collection, query, where, doc, setDoc, deleteDoc, getDoc, getDocs, type DocumentData, type Timestamp } from "firebase/firestore";
import { getFirebase } from "./firebase.client";

export interface UserProfile extends DocumentData {
    uid: string;
    name?: string;
    email?: string;
    administrator?: boolean;
    canCreate?: boolean;
    canRead?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    created?: Timestamp;
}

function userStore() {
    const { subscribe, set } = writable<UserProfile[]>([]);

    return {
        subscribe,
        getUserByEmail: async (email: string): Promise<UserProfile | null> => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return null;
            }
            const q = query(collection(firebase.db, "profiles"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return null;
            }

            const userDoc = querySnapshot.docs[0];
            return { ...userDoc.data(), uid: userDoc.id } as UserProfile;
        },
        getUserByFirebaseId: async (firebaseId: string): Promise<UserProfile | null> => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return null;
            }
            const docRef = doc(firebase.db, 'profiles', firebaseId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
            } else {
                return null;
            }
        },
        init: () => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return;
            }
            onSnapshot(collection(firebase.db, "profiles"), (snapshot) => {
                const props: UserProfile[] = [];
                snapshot.forEach((post) => {
                    props.push({ ...post.data(), uid: post.id } as UserProfile);
                });
                set(props);
            });
        },
        getPurgatoryUsers: async (): Promise<UserProfile[]> => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return [];
            }
            const purgatorySnapshot = await getDocs(collection(firebase.db, "purgatory"));
            return purgatorySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
        },
        approveUser: async (userId: string, permissions: Partial<UserProfile>) => {
            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                return;
            }
            const purgatoryDoc = await getDoc(doc(firebase.db, "purgatory", userId));
            if (purgatoryDoc.exists()) {
                const userData = purgatoryDoc.data();
                await setDoc(doc(firebase.db, "profiles", userId), {
                    ...userData,
                    ...permissions,
                    approved: true
                });
                await deleteDoc(doc(firebase.db, "purgatory", userId));
            }
        },
    };
}

export const users = userStore();

// Initialize the store
users.init();