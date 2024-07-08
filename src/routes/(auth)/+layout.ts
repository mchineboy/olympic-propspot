import { getFirebase } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { onAuthStateChanged, type User } from 'firebase/auth';

export async function load({ url }) {
    function getAuthUser() {
        return new Promise<User | false>((resolve) => {
            if (!browser) {
                resolve(false);
                return;
            }

            const firebase = getFirebase();
            if (!firebase) {
                console.error("Firebase is not initialized");
                resolve(false);
                return;
            }

            const { auth } = firebase;
            onAuthStateChanged(auth, (user) => resolve(user ? user : false));
        });
    }

    return {
        getAuthUser: getAuthUser,
        url: url.pathname
    };
}