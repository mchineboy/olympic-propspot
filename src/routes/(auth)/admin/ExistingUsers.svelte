<script lang="ts">
    import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
    import { firestore } from '$lib/firebase';
    import { getFunctions, httpsCallable } from 'firebase/functions';
    import type { UserProfile } from '$lib/users';

    export let allUsers: UserProfile[];

    async function updateUser(user: UserProfile) {
        try {
            await updateDoc(doc(firestore, 'users', user.uid), {
                administrator: user.administrator,
                canCreate: user.canCreate,
                canRead: user.canRead,
                canUpdate: user.canUpdate,
                canDelete: user.canDelete
            });
            console.log('User updated:', user.uid);
        } catch (error) {
            console.error('Error updating user: ', error);
        }
    }

    async function deleteUser(userId: string) {
        try {
            // Call the Cloud Function
            const functions = getFunctions();
            const deleteUserFunction = httpsCallable(functions, 'deleteUser');
            await deleteUserFunction({ uid: userId });

            // If the Cloud Function succeeds, remove the user from local state
            allUsers = allUsers.filter(user => user.uid !== userId);
            console.log('User deleted:', userId);
        } catch (error) {
            console.error('Error deleting user: ', error);
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