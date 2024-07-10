// $lib/types.ts

import { type DocumentData, Timestamp } from '@firebase/firestore-types';

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

export interface SessionData {
    user: UserProfile | null;
    loggedIn: boolean;
    loading: boolean;
}