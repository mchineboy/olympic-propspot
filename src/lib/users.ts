import { writable } from "svelte/store";
import { onSnapshot, collection, query, where, doc, setDoc, deleteDoc, getDoc, getDocs, type DocumentData, type Timestamp } from "firebase/firestore";
import { firestore } from "./firebase";

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
            const q = query(collection(firestore, "profiles"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return null;
            }

            const userDoc = querySnapshot.docs[0];
            return { ...userDoc.data(), uid: userDoc.id } as UserProfile;
        },
        getUserByFirebaseId: async (firebaseId: string): Promise<UserProfile | null> => {
            const docRef = doc(firestore, 'profiles', firebaseId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
            } else {
                return null;
            }
        },
        init: () => {
            onSnapshot(collection(firestore, "profiles"), (snapshot) => {
                const props: UserProfile[] = [];
                snapshot.forEach((post) => {
                    props.push({ ...post.data(), uid: post.id } as UserProfile);
                });
                set(props);
            });
        },
        getPurgatoryUsers: async (): Promise<UserProfile[]> => {
            const purgatorySnapshot = await getDocs(collection(firestore, "purgatory"));
            return purgatorySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
        },
        approveUser: async (userId: string, permissions: Partial<UserProfile>) => {
            const purgatoryDoc = await getDoc(doc(firestore, "purgatory", userId));
            if (purgatoryDoc.exists()) {
            const userData = purgatoryDoc.data();
            await setDoc(doc(firestore, "profiles", userId), {
                ...userData,
                ...permissions,
                approved: true
            });
            await deleteDoc(doc(firestore, "purgatory", userId));
            }
        },
    };
}

export const users = userStore();

// Initialize the store
users.init();