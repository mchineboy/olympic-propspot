import { writable } from 'svelte/store';

export interface SessionUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
}

export interface SessionData {
  loggedIn: boolean;
  user: SessionUser | null;
}

export const defaultSession: SessionData = {
  loggedIn: false,
  user: null
};

export const session = writable<SessionData>(defaultSession);