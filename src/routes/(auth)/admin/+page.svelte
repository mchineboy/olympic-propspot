<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/session';
    import { isAdmin } from '$lib/auth.service';
    import { goto } from '$app/navigation';
    import AdminPanel from './AdminPanel.svelte';

    let loading = true;
    let isAdminUser = false;

    onMount(async () => {
        // Check if the user is logged in and is an admin
        const user = $session.user;
        if (!user) {
            goto('/login'); // Redirect to login if not authenticated
            return;
        }

        isAdminUser = isAdmin(user);
        if (!isAdminUser) {
            goto('/'); // Redirect to home if not an admin
            return;
        }

        loading = false;
    });
</script>

<svelte:head>
    <title>Admin Panel | Olympic PropSpot</title>
</svelte:head>

{#if loading}
    <div class="flex items-center justify-center h-screen">
        <div class="w-32 h-32 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
    </div>
{:else if isAdminUser}
    <AdminPanel />
{:else}
    <div class="container px-4 py-8 mx-auto">
        <h1 class="mb-4 text-4xl font-bold text-purple-800">Access Denied</h1>
        <p class="text-lg">You do not have permission to view this page.</p>
    </div>
{/if}