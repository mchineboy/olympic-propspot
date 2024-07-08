import { writable } from "svelte/store";
import { onSnapshot, collection, type DocumentData, type Timestamp } from "firebase/firestore";
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
    const { subscribe } = writable<UserProfile[]>([], (set) => {
      onSnapshot(collection(firestore, "props"), (snapshot) => {
        const props: UserProfile[] = [];
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

export const props = userStore();