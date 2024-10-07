<script lang="ts">
    import { getFirebase } from '$lib/firebase.client';
    import { getFunctions, httpsCallable } from 'firebase/functions';
    import { updateDoc, doc } from 'firebase/firestore';
    import type { UserProfile } from '$lib/users';

    export let allUsers: UserProfile[];

    async function updateUser(user: UserProfile) {
        const firebase = getFirebase();
        if (!firebase) {
            console.error("Firebase is not initialized");
            return;
        }

        try {
            await updateDoc(doc(firebase.db, 'users', user.uid), {
                administrator: user.administrator,
                canCreate: user.canCreate,
                canRead: user.canRead,
                canUpdate: user.canUpdate,
                canDelete: user.canDelete
            });
        } catch (error) {
            console.error('Error updating user: ', error);
        }
    }

    async function deleteUser(userId: string) {
        if (!userId || userId.length > 128) {
            return;
        }
        try {
            const functions = getFunctions(getFirebase()?.app);
            const deleteUserFunction = httpsCallable(functions, 'deleteUserV2');
            await deleteUserFunction({ uid: userId });
            
            // If the Cloud Function succeeds, remove the user from local state
            allUsers = allUsers.filter(user => user.uid !== userId);
        } catch (error) {
            alert('Error deleting user: ' + (error as Error).message);
        }
    }
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="mb-4 text-2xl font-semibold text-purple-700">Existing Users</h2>
    <div class="overflow-x-auto">
        <table class="w-full table-auto">
            <thead>
                <tr class="bg-purple-200">
                    <th class="px-4 py-2 text-left">Name</th>
                    <th class="px-4 py-2 text-left">Email</th>
                    <th class="px-4 py-2 text-center">Admin</th>
                    <th class="px-4 py-2 text-center">Create</th>
                    <th class="px-4 py-2 text-center">Read</th>
                    <th class="px-4 py-2 text-center">Update</th>
                    <th class="px-4 py-2 text-center">Delete</th>
                    <th class="px-4 py-2 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each allUsers as user}
                    <tr class="border-b border-purple-100">
                        <td class="px-4 py-2">{user.name}</td>
                        <td class="px-4 py-2">{user.email}</td>
                        <td class="px-4 py-2 text-center">
                            <input type="checkbox" bind:checked={user.administrator} on:change={() => updateUser(user)} class="form-checkbox text-gold-500" />
                        </td>
                        <td class="px-4 py-2 text-center">
                            <input type="checkbox" bind:checked={user.canCreate} on:change={() => updateUser(user)} class="form-checkbox text-gold-500" />
                        </td>
                        <td class="px-4 py-2 text-center">
                            <input type="checkbox" bind:checked={user.canRead} on:change={() => updateUser(user)} class="form-checkbox text-gold-500" />
                        </td>
                        <td class="px-4 py-2 text-center">
                            <input type="checkbox" bind:checked={user.canUpdate} on:change={() => updateUser(user)} class="form-checkbox text-gold-500" />
                        </td>
                        <td class="px-4 py-2 text-center">
                            <input type="checkbox" bind:checked={user.canDelete} on:change={() => updateUser(user)} class="form-checkbox text-gold-500" />
                        </td>
                        <td class="px-4 py-2 text-center">
                            <button on:click={() => deleteUser(user.uid)} class="px-2 py-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>