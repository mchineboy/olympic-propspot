import { writable } from "svelte/store";
import { 
  onSnapshot, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  getDocs,
  getDoc,
  type DocumentData, 
  type Timestamp 
} from "firebase/firestore";
import { getFirebase } from "./firebase.client";

export interface PropAttribute {
  name: string;
  value: string;
}

export const categories = ['Clothing', 'Furniture', 'Accessories', 'Electronics', 'Wigs', 'Other'] as const;
export type Category = typeof categories[number];

export interface Prop extends DocumentData {
    id: string;
    name?: string;
    category?: Category | undefined;
    type?: string;
    imageUrl?: string;
    imagePreviewUrl?: string;
    lastUsed?: Timestamp;
    location?: string;
    color?: string;
    size?: string;
    material?: string;
    hairColor?: string;
    hairLength?: string;
    hairStyle?: string;
    attributes?: PropAttribute[];
    notes?: string;
    tags?: string[];
  }

function propsStore() {
    const { subscribe, set } = writable<Prop[]>([]);
    let unsubscribe: (() => void) | null = null;

    return {
        subscribe,
        
        // Create
        addProp: async (prop: Omit<Prop, 'id'>) => {
            const firebase = getFirebase();
            if (!firebase) throw new Error("Firebase is not initialized");
            try {
                const docRef = await addDoc(collection(firebase.db, "props"), prop);
                return docRef.id;
            } catch (error) {
                console.error("Error adding prop: ", error);
                throw error;
            }
        },

        // Read (single prop)
        getProp: async (id: string) => {
            const firebase = getFirebase();
            if (!firebase) throw new Error("Firebase is not initialized");
            const docRef = doc(firebase.db, "props", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Prop;
            } else {
                return null;
            }
        },

        // Update
        updateProp: async (id: string, prop: Partial<Prop>) => {
            const firebase = getFirebase();
            if (!firebase) throw new Error("Firebase is not initialized");
            try {
                const docRef = doc(firebase.db, "props", id);
                await updateDoc(docRef, prop);
            } catch (error) {
                console.error("Error updating prop: ", error);
                throw error;
            }
        },

        // Delete
        deleteProp: async (id: string) => {
            const firebase = getFirebase();
            if (!firebase) throw new Error("Firebase is not initialized");
            try {
                const docRef = doc(firebase.db, "props", id);
                await deleteDoc(docRef);
            } catch (error) {
                console.error("Error deleting prop: ", error);
                throw error;
            }
        },

        // Search function
        searchProps: async (searchTerms: string) => {
            const firebase = getFirebase();
            if (!firebase) throw new Error("Firebase is not initialized");
            const terms = searchTerms.toLowerCase().split(' ');
            
            let q = query(collection(firebase.db, "props"));
            
            // Add specific queries for hair-related terms
            if (terms.includes('blonde')) {
                q = query(q, where("hairColor", "==", "blonde"));
            }
            if (terms.includes('long')) {
                q = query(q, where("hairLength", "==", "long"));
            }
            if (terms.includes('wig')) {
                q = query(q, where("type", "==", "wig"));
            }
            
            const querySnapshot = await getDocs(q);
            
            const results: Prop[] = [];
            querySnapshot.forEach((doc) => {
                const prop = { id: doc.id, ...doc.data() } as Prop;
                const searchableText = `${prop.name} ${prop.category} ${prop.color} ${prop.size} ${prop.material} ${prop.type} ${prop.hairColor} ${prop.hairLength} ${prop.hairStyle} ${prop.notes} ${prop.tags?.join(' ')}`.toLowerCase();
                
                if (terms.every(term => searchableText.includes(term))) {
                    results.push(prop);
                }
            });

            return results;
        },

        // Initialize store
        init: () => {
            console.log("Props store init called");
            if (unsubscribe) {
              console.warn('Store is already initialized. Call stop() before reinitializing.');
              return;
            }
            const firebase = getFirebase();
            if (!firebase) {
              console.error("Firebase is not initialized in props store init");
              throw new Error("Firebase is not initialized");
            }
            console.log("Setting up Firestore listener");
            unsubscribe = onSnapshot(collection(firebase.db, "props"), (snapshot) => {
              console.log("Firestore snapshot received", snapshot.size);
              const props: Prop[] = [];
              snapshot.forEach((doc) => {
                props.push({ ...doc.data(), id: doc.id } as Prop);
              });
              console.log('Fetched props:', props);
              set(props);
            }, (error) => {
              console.error("Firestore listener error:", error);
            });
          },

        // Stop listening to updates
        stop: () => {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        },

        // Check if the store is initialized
        isInitialized: () => {
            return unsubscribe !== null;
        }
    };
}

export const props = propsStore();

// Remove automatic initialization
// props.init();