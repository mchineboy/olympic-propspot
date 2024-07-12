<script lang="ts">
	import { session } from '$lib/session';
	import { isAdmin } from '$lib/auth.service';
	import { users } from '$lib/users';
	import type { UserProfile } from '$lib/users';
	import { updateDoc, doc, deleteDoc, getDocs, setDoc, collection } from 'firebase/firestore';
	import { firestore } from '$lib/firebase';

	$: currentUser = $session.user;
	$: isAdminUser = isAdmin(currentUser);

	let allUsers: UserProfile[] = [];
	let purgatoryUsers: any[] = [];

	$: allUsers = $users;

	async function loadPurgatoryUsers() {
		const purgatorySnapshot = await getDocs(collection(firestore, 'purgatory'));
		purgatoryUsers = purgatorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	}

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
			await deleteDoc(doc(firestore, 'users', userId));
			console.log('User deleted:', userId);
		} catch (error) {
			console.error('Error deleting user: ', error);
		}
	}

	async function approveUser(user: any) {
		try {
			// Move user from purgatory to profiles
			await setDoc(doc(firestore, 'profiles', user.id), {
				name: user.name,
				email: user.email,
				administrator: false,
				canCreate: true,
				canRead: true,
				canUpdate: false,
				canDelete: false,
				created: user.registeredAt
			});

			// Remove user from purgatory
			await deleteDoc(doc(firestore, 'purgatory', user.id));

			// Refresh purgatory users list
			await loadPurgatoryUsers();
		} catch (error) {
			console.error('Error approving user:', error);
		}
	}

	async function rejectUser(userId: string) {
		try {
			// Remove user from purgatory
			await deleteDoc(doc(firestore, 'purgatory', userId));

			// Refresh purgatory users list
			await loadPurgatoryUsers();
		} catch (error) {
			console.error('Error rejecting user:', error);
		}
	}

	// Load purgatory users when the component mounts
	loadPurgatoryUsers();
</script>

{#if isAdminUser}
	<div class="container px-4 py-8 mx-auto">
		<h1 class="mb-8 text-4xl font-bold text-purple-800">User Management</h1>

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
									<button
										on:click={() => approveUser(user)}
										class="px-2 py-1 mr-2 text-white transition-colors bg-green-500 rounded hover:bg-green-600"
									>
										Approve
									</button>
									<button
										on:click={() => rejectUser(user.id)}
										class="px-2 py-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
									>
										Reject
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
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
						{#each allUsers as user}
							<tr class="border-b border-purple-100">
								<td class="px-4 py-2">{user.name}</td>
								<td class="px-4 py-2">{user.email}</td>
								<td class="px-4 py-2 text-center"
									><input
										type="checkbox"
										bind:checked={user.administrator}
										on:change={() => updateUser(user)}
										class="form-checkbox text-gold-500"
									/></td
								>
								<td class="px-4 py-2 text-center"
									><input
										type="checkbox"
										bind:checked={user.canCreate}
										on:change={() => updateUser(user)}
										class="form-checkbox text-gold-500"
									/></td
								>
								<td class="px-4 py-2 text-center"
									><input
										type="checkbox"
										bind:checked={user.canRead}
										on:change={() => updateUser(user)}
										class="form-checkbox text-gold-500"
									/></td
								>
								<td class="px-4 py-2 text-center"
									><input
										type="checkbox"
										bind:checked={user.canUpdate}
										on:change={() => updateUser(user)}
										class="form-checkbox text-gold-500"
									/></td
								>
								<td class="px-4 py-2 text-center"
									><input
										type="checkbox"
										bind:checked={user.canDelete}
										on:change={() => updateUser(user)}
										class="form-checkbox text-gold-500"
									/></td
								>
								<td class="px-4 py-2 text-center">
									<button
										on:click={() => deleteUser(user.uid)}
										class="px-2 py-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
										>Delete</button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{:else}
	<div class="container px-4 py-8 mx-auto">
		<h1 class="mb-8 text-4xl font-bold text-purple-800">Access Denied</h1>
		<p>You do not have permission to view this page.</p>
	</div>
{/if}