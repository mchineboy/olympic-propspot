import { writable } from "svelte/store";
import { onSnapshot, collection, type DocumentData, type Timestamp } from "firebase/firestore";
import { firestore } from "./firebase";

export interface PropAttribute {
    name: string;
    value: string;
  }

interface Prop extends DocumentData {
  id: string;
  name?: string;
  category?: string;
  imageUrl?: string;
  lastUsed?: Timestamp;
  location?: string;
  
  color?: string;
  size?: string;
  material?: string;
  
  type?: string; // e.g., "blouse", "pants", "hat"
  
  hairColor?: string;
  hairLength?: string;
  hairStyle?: string;

  attributes?: PropAttribute[];

  notes?: string;
  tags?: string[];
}

function propsStore() {
    const { subscribe } = writable<Prop[]>([], (set) => {
      onSnapshot(collection(firestore, "props"), (snapshot) => {
        const props: Prop[] = [];
        snapshot.forEach((post) => {
          props.push({ ...post.data(), id: post.id });
        });
  
        set(props);
      });
    });
  
    return {
      subscribe,
    };
  }

export const props = propsStore();