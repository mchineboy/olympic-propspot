<script lang="ts">
    import { session } from '$lib/session';
    import { isAdmin } from '$lib/auth.service';
    import { users } from '$lib/users';
    import PendingApprovals from './PendingApprovals.svelte';
    import ExistingUsers from './ExistingUsers.svelte';

    $: currentUser = $session.user;
    $: isAdminUser = isAdmin(currentUser);
    $: allUsers = $users;
</script>

{#if isAdminUser}
    <div class="container px-4 py-8 mx-auto">
        <h1 class="mb-8 text-4xl font-bold text-purple-800">User Management</h1>
        <PendingApprovals />
        <ExistingUsers {allUsers} />
    </div>
{:else}
    <div class="container px-4 py-8 mx-auto">
        <h1 class="mb-8 text-4xl font-bold text-purple-800">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
    </div>
{/if}