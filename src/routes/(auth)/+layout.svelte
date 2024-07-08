<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/session';
    import { goto } from '$app/navigation';
    import { signOut } from 'firebase/auth';
    import { getFirebase } from '$lib/firebase.client';
    import Nav from '../../components/Nav.svelte';
    import '../../app.css';

    import type { LayoutData } from './$types';
    export let data: LayoutData;

    let loading: boolean = true;
    let loggedIn: boolean = false;
    let user: any = null;

    session.subscribe((cur: any) => {
        loading = cur?.loading;
        loggedIn = cur?.loggedIn;
        user = cur?.user;
    });

    onMount(async () => {
        const user: any = await data.getAuthUser();

        const loggedIn = !!user && user?.emailVerified;
        session.update((cur: any) => {
            loading = false;
            return {
                ...cur,
                user,
                loggedIn,
                loading: false
            };
        });

        if (!loggedIn) {
            goto('/login');
        }
    });

    async function logout() {
        try {
            const firebase = getFirebase();
            if (!firebase) {
                throw new Error("Firebase is not initialized");
            }
            const { auth } = firebase;
            await signOut(auth);
            goto('/login');
            loggedIn = false;
        } catch (error) {
            console.error("Logout error:", error);
            // Handle the error appropriately (e.g., show an error message to the user)
        }
    }
</script>

<Nav {loading} {loggedIn} {user} {logout} />

{#if loading}
    <div>Loading...</div>
{:else if !loggedIn}
    <div>Redirecting to login...</div>
{:else}
    <div>
        <h1>Welcome, {user.displayName}</h1>
        <slot />
    </div>
{/if}