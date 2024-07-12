// auth.service.ts
import { getFirebase } from '$lib/firebase.client';
import { session, type SessionData } from '$lib/session';
import { type User } from 'firebase/auth';
import { type UserProfile } from '$lib/users';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function createSessionUser(firebaseUser: User, userProfile: UserProfile | null): SessionData['user'] {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || undefined,
        displayName: firebaseUser.displayName || userProfile?.name,
        photoURL: firebaseUser.photoURL,
        administrator: userProfile?.administrator || false,
        canCreate: userProfile?.canCreate || false,
        canRead: userProfile?.canRead || false,
        canUpdate: userProfile?.canUpdate || false,
        canDelete: userProfile?.canDelete || false,
        // Add any other properties from UserProfile that you need
    };
}

export async function initializeAuth() {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');

    firebase.auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userProfile = await getUserProfile(user.uid);
            session.set({
                loggedIn: true,
                user: createSessionUser(user, userProfile),
                loading: false
            });
        } else {
            session.set({ loggedIn: false, user: null, loading: false });
        }
    });
}

async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');

    const docRef = doc(firebase.db, 'profiles', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
    } else {
        return null;
    }
}

export function isAdmin(user: SessionData['user']): boolean {
    return user?.administrator ?? false;
}

export async function requireAdmin() {
    console.log('requireAdmin started');
    return new Promise<void>((resolve, reject) => {
        const unsubscribe = session.subscribe(({ user, loading }) => {
            console.log('Session state:', { user, loading });
            if (!loading) {
                unsubscribe();
                if (isAdmin(user)) {
                    console.log('User is admin, resolving');
                    resolve();
                } else {
                    console.log('User is not admin, rejecting');
                    reject(new Error('Not authorized'));
                }
            }
        });
    });
}

export async function registerWithEmailAndPassword(email: string, password: string, name: string): Promise<void> {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');

    try {
        const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);
        await setDoc(doc(firebase.db, 'purgatory', userCredential.user.uid), {
            name,
            email,
            registeredAt: new Date(),
            status: 'pending'
        });
        // Sign out the user immediately after registration
        await firebase.auth.signOut();
    } catch (error) {
        console.error("Error registering new user:", error);
        throw error;
    }
}

export async function loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');

    try {
        await signInWithEmailAndPassword(firebase.auth, email, password);
        // The session will be updated by the onAuthStateChanged listener
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export async function loginWithGoogle(): Promise<void> {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(firebase.auth, provider);
        
        const userProfile = await getUserProfile(result.user.uid);
        
        if (!userProfile) {
            // User is not registered, add to purgatory
            await setDoc(doc(firebase.db, 'purgatory', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                registeredAt: new Date(),
                status: 'pending'
            });
            
            // Sign out the user
            await firebase.auth.signOut();
            throw new Error('Your account is pending approval. Please wait for an administrator to approve your account.');
        }
        // If userProfile exists, the session will be updated by the onAuthStateChanged listener
    } catch (error) {
        console.error("Error logging in with Google:", error);
        throw error;
    }
}

export async function logout() {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');
    
    await firebase.auth.signOut();
    session.set({ loggedIn: false, user: null, loading: false });
    goto('/login');
}

export async function resetPassword(email: string): Promise<void> {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');

    try {
        await sendPasswordResetEmail(firebase.auth, email);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
}

export function getCurrentUser(): SessionData['user'] | null {
    return get(session).user;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const firebase = getFirebase();
    if (!firebase) throw new Error('Firebase not initialized');

    const docRef = doc(firebase.db, 'profiles', uid);
    await setDoc(docRef, updates, { merge: true });

    // Update the session
    const currentSession = get(session);
    if (currentSession.user && currentSession.user.uid === uid) {
        session.set({
            ...currentSession,
            user: { ...currentSession.user, ...updates }
        });
    }
}