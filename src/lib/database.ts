import {
	collection,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	query,
	where,
	getDocs,
    QueryConstraint
} from 'firebase/firestore';
import type { Prop } from '../types/props'; // Assuming the correct relative path to the 'props' type
import { firestore as db } from '../lib/firebase'; // Assume you have Firebase initialized here

export const propCollection = collection(db, 'props');

export async function addProp(prop: Omit<Prop, 'id'>): Promise<string> {
	const docRef = await addDoc(propCollection, prop);
	return docRef.id;
}

export async function updateProp(id: string, prop: Partial<Prop>): Promise<void> {
	await updateDoc(doc(propCollection, id), prop);
}

export async function deleteProp(id: string): Promise<void> {
	await deleteDoc(doc(propCollection, id));
}

export async function getProp(id: string): Promise<Prop | null> {
	const docRef = doc(propCollection, id);
	const docSnap = await getDoc(docRef);
	return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Prop) : null;
}

export async function searchProps(criteria: Partial<Prop>): Promise<Prop[]> {
	const constraints: QueryConstraint[] = [];

	Object.entries(criteria).forEach(([key, value]) => {
		if (key !== 'attributes' && value !== undefined) {
			constraints.push(where(key, '==', value));
		}
	});

	const q = query(propCollection, ...constraints);

	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Prop);
}

