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
import { firestore } from "./firebase";

export interface PropAttribute {
  name: string;
  value: string;
}

export interface Prop extends DocumentData {
    id: string;
    name?: string;
    category?: string;
    type?: string;
    imageUrl?: string;
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
            try {
                const docRef = await addDoc(collection(firestore, "props"), prop);
                return docRef.id;
            } catch (error) {
                console.error("Error adding prop: ", error);
                throw error;
            }
        },

        // Read (single prop)
        getProp: async (id: string) => {
            const docRef = doc(firestore, "props", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Prop;
            } else {
                return null;
            }
        },

        // Update
        updateProp: async (id: string, prop: Partial<Prop>) => {
            try {
                const docRef = doc(firestore, "props", id);
                await updateDoc(docRef, prop);
            } catch (error) {
                console.error("Error updating prop: ", error);
                throw error;
            }
        },

        // Delete
        deleteProp: async (id: string) => {
            try {
                const docRef = doc(firestore, "props", id);
                await deleteDoc(docRef);
            } catch (error) {
                console.error("Error deleting prop: ", error);
                throw error;
            }
        },

        // Search function
        searchProps: async (searchTerms: string) => {
            const terms = searchTerms.toLowerCase().split(' ');
            
            let q = query(collection(firestore, "props"));
            
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
            if (unsubscribe) {
                console.warn('Store is already initialized. Call stop() before reinitializing.');
                return;
            }
            unsubscribe = onSnapshot(collection(firestore, "props"), (snapshot) => {
                const props: Prop[] = [];
                snapshot.forEach((doc) => {
                    props.push({ ...doc.data(), id: doc.id } as Prop);
                });
                set(props);
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

// Initialize the store
props.init();