<script lang="ts">
    import { onMount } from 'svelte';
    import { getFirebase } from '$lib/firebase.client';
    import { getDocs, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';

    let purgatoryUsers: any[] = [];

    async function loadPurgatoryUsers() {
        const firebase = getFirebase();
        if (!firebase) {
            console.error("Firebase is not initialized");
            return;
        }

        const purgatorySnapshot = await getDocs(collection(firebase.db, 'purgatory'));
        purgatoryUsers = purgatorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async function approveUser(user: any) {
        const firebase = getFirebase();
        if (!firebase) {
            console.error("Firebase is not initialized");
            return;
        }

        try {
            await setDoc(doc(firebase.db, 'profiles', user.id), {
                name: user.name,
                email: user.email,
                administrator: false,
                canCreate: true,
                canRead: true,
                canUpdate: false,
                canDelete: false,
                created: user.registeredAt,
                approved: true
            });
            await deleteDoc(doc(firebase.db, 'purgatory', user.id));
            await loadPurgatoryUsers();
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Error approving user: ' + (error as Error).message);
        }
    }

    async function rejectUser(userId: string) {
        const firebase = getFirebase();
        if (!firebase) {
            console.error("Firebase is not initialized");
            return;
        }

        try {
            await deleteDoc(doc(firebase.db, 'purgatory', userId));
            await loadPurgatoryUsers();
        } catch (error) {
            console.error('Error rejecting user:', error);
        }
    }

    onMount(loadPurgatoryUsers);
</script>

{#if purgatoryUsers.length > 0}
    <div class="p-6 mb-8 bg-yellow-100 rounded-lg shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-yellow-700">Pending Approvals</h2>
        <div class="overflow-x-auto">
            <table class="w-full table-auto">
                <thead>
                    <tr class="bg-yellow-200">
                        <th class="px-4 py-2 text-left">Name</th>
                        <th class="px-4 py-2 text-left">Email</th>
                        <th class="px-4 py-2 text-left">Registered At</th>
                        <th class="px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each purgatoryUsers as user}
                        <tr class="border-b border-yellow-100">
                            <td class="px-4 py-2">{user.name}</td>
                            <td class="px-4 py-2">{user.email}</td>
                            <td class="px-4 py-2">{new Date(user.registeredAt.seconds * 1000).toLocaleString()}</td>
                            <td class="px-4 py-2 text-center">
                                <button on:click={() => approveUser(user)} class="px-2 py-1 mr-2 text-white transition-colors bg-green-500 rounded hover:bg-green-600">
                                    Approve
                                </button>
                                <button on:click={() => rejectUser(user.id)} class="px-2 py-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600">
                                    Reject
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{/if}