
import { writable } from "svelte/store";
import { onSnapshot, collection } from "firebase/firestore";
import { firestore } from "../firebase";

function propsStore() {
    const { subscribe } = writable([], (set) => {
      onSnapshot(collection(firestore, "props"), (snapshot) => {
        const props: any = [];
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