import { writable } from "svelte/store";
import { onSnapshot, collection, query, where, doc, getDoc, getDocs, type DocumentData, type Timestamp } from "firebase/firestore";
import { firestore } from "./firebase";

export interface UserProfile extends DocumentData {
    id: string;
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
            return { ...userDoc.data(), id: userDoc.id } as UserProfile;
        },
        getUserByFirebaseId: async (firebaseId: string): Promise<UserProfile | null> => {
            const docRef = doc(firestore, 'profiles', firebaseId);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                return null;
            }
        
            return { ...docSnap.data(), id: docSnap.id } as UserProfile;
        },
        init: () => {
            onSnapshot(collection(firestore, "props"), (snapshot) => {
                const props: UserProfile[] = [];
                snapshot.forEach((post) => {
                    props.push({ ...post.data(), id: post.id } as UserProfile);
                });
                set(props);
            });
        }
    };
}

export const users = userStore();

// Initialize the store
users.init();