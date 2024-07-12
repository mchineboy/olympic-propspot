import { writable } from 'svelte/store';

import { type UserProfile } from '$lib/users';

export interface FirebaseUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  administrator: boolean;
}

export interface SessionData {
  loggedIn: boolean;
  user: UserProfile | null;
  loading: boolean;
}

export const defaultSession: SessionData = {
  loggedIn: false,
  user: null,
  loading: true
};

export const session = writable<SessionData>(defaultSession);

export function updateSession(data: Partial<SessionData>) {
  session.update(currentSession => ({
    ...currentSession,
    ...data
  }));
}