<script lang="ts">
    import { users as props, type UserProfile } from '$lib/users';
    import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
    import { firestore } from '$lib/firebase';
    
    let users: UserProfile[] = [];
    let newUser = {
        name: '',
        email: '',
        administrator: false,
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false
    };
    
    $: users = $props;
    
    async function inviteUser() {
        try {
            const userRef = await addDoc(collection(firestore, "users"), {
                ...newUser,
                created: new Date()
            });
            console.log('User invited with ID:', userRef.id);
            // Reset form after invitation
            newUser = {
                name: '',
                email: '',
                administrator: false,
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false
            };
        } catch (error) {
            console.error("Error inviting user: ", error);
        }
    }
    
    async function updateUser(user: UserProfile) {
        try {
            await updateDoc(doc(firestore, "users", user.id), {
                administrator: user.administrator,
                canCreate: user.canCreate,
                canRead: user.canRead,
                canUpdate: user.canUpdate,
                canDelete: user.canDelete
            });
            console.log('User updated:', user.id);
        } catch (error) {
            console.error("Error updating user: ", error);
        }
    }
    
    async function deleteUser(userId: string) {
        try {
            await deleteDoc(doc(firestore, "users", userId));
            console.log('User deleted:', userId);
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    }
    </script>
    
    <div class="container px-4 py-8 mx-auto">
        <h1 class="mb-8 text-4xl font-bold text-purple-800">User Management</h1>
    
        <div class="p-6 mb-8 bg-purple-100 rounded-lg shadow-md">
            <h2 class="mb-4 text-2xl font-semibold text-purple-700">Invite New User</h2>
            <form on:submit|preventDefault={inviteUser} class="space-y-4">
                <input type="text" placeholder="Name" bind:value={newUser.name} required class="w-full p-2 border border-purple-300 rounded">
                <input type="email" placeholder="Email" bind:value={newUser.email} required class="w-full p-2 border border-purple-300 rounded">
                <div class="space-y-2">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={newUser.administrator} class="form-checkbox text-gold-500">
                        <span>Administrator</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={newUser.canCreate} class="form-checkbox text-gold-500">
                        <span>Can Create</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={newUser.canRead} class="form-checkbox text-gold-500">
                        <span>Can Read</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={newUser.canUpdate} class="form-checkbox text-gold-500">
                        <span>Can Update</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" bind:checked={newUser.canDelete} class="form-checkbox text-gold-500">
                        <span>Can Delete</span>
                    </label>
                </div>
                <button type="submit" class="px-4 py-2 text-white transition-colors bg-yellow-500 rounded hover:bg-yellow-600">Invite User</button>
            </form>
        </div>
    
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
                        {#each users as user}
                            <tr class="border-b border-purple-100">
                                <td class="px-4 py-2">{user.name}</td>
                                <td class="px-4 py-2">{user.email}</td>
                                <td class="px-4 py-2 text-center"><input type="checkbox" bind:checked={user.administrator} on:change={() => updateUser(user)} class="form-checkbox text-gold-500"></td>
                                <td class="px-4 py-2 text-center"><input type="checkbox" bind:checked={user.canCreate} on:change={() => updateUser(user)} class="form-checkbox text-gold-500"></td>
                                <td class="px-4 py-2 text-center"><input type="checkbox" bind:checked={user.canRead} on:change={() => updateUser(user)} class="form-checkbox text-gold-500"></td>
                                <td class="px-4 py-2 text-center"><input type="checkbox" bind:checked={user.canUpdate} on:change={() => updateUser(user)} class="form-checkbox text-gold-500"></td>
                                <td class="px-4 py-2 text-center"><input type="checkbox" bind:checked={user.canDelete} on:change={() => updateUser(user)} class="form-checkbox text-gold-500"></td>
                                <td class="px-4 py-2 text-center">
                                    <button on:click={() => deleteUser(user.id)} class="px-2 py-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>