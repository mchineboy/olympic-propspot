import { session } from '$lib/session';
import { redirect } from '@sveltejs/kit';
import { type UserProfile } from '$lib/users';
import { get } from 'svelte/store';

export async function load() {
    // Wait for the session to be loaded
    await new Promise(resolve => {
        const unsubscribe = session.subscribe(value => {
            unsubscribe();
            resolve(value);
        });
    });

    const currentUser = get(session).user as UserProfile | null;

    console.log(`currentUser: ${JSON.stringify(currentUser, null, 2)}`);

    if (!currentUser || !currentUser.administrator) {
        throw redirect(303, '/dashboard');
    }

    return {};
}