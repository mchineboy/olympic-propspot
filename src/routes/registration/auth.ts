import { getFirebase } from '$lib/firebase.client';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function registerWithEmailAndPassword(email: string, password: string, name: string): Promise<void> {
  const firebase = getFirebase();
  if (!firebase) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);
    await addUserToPurgatory(userCredential.user.uid, name, email);
    await signOut(firebase.auth); // Sign out the user immediately
  } catch (error) {
    console.error("Error registering new user:", error);
    throw new Error(error instanceof Error ? error.message : 'Failed to register user');
  }
}

export async function registerWithGoogle(): Promise<void> {
  const firebase = getFirebase();
  if (!firebase) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebase.auth, provider);
    await addUserToPurgatory(result.user.uid, result.user.displayName || "", result.user.email || "");
    await signOut(firebase.auth); // Sign out the user immediately
  } catch (error) {
    console.error("Error registering with Google:", error);
    throw new Error(error instanceof Error ? error.message : 'Failed to register with Google');
  }
}

async function addUserToPurgatory(uid: string, name: string, email: string) {
  const firebase = getFirebase();
  if (!firebase) {
    throw new Error('Firebase is not initialized');
  }

  try {
    await setDoc(doc(firebase.db, "purgatory", uid), {
      name,
      email,
      registeredAt: new Date(),
      status: "pending"
    });
  } catch (error) {
    console.error("Error adding user to purgatory:", error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add user to purgatory');
  }
}

export async function isUserApproved(uid: string): Promise<boolean> {
  const firebase = getFirebase();
  if (!firebase) {
    throw new Error('Firebase is not initialized');
  }

  const userDoc = await getDoc(doc(firebase.db, 'profiles', uid));
  return userDoc.exists() && userDoc.data()?.approved === true;
}