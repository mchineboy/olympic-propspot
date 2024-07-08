<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase.client';
	import Nav from '../components/Nav.svelte';
	import '../app.css';

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

		if (loggedIn) {
			goto('/');
		}
	});

	function logout() {
		signOut(auth)
			.then(() => {
				goto('/login');
				loggedIn = false;
			})
			.catch((error) => {
				throw new Error(error);
			});
	}
</script>

<Nav {loading} {loggedIn} {user} {logout} />

{#if loading}
	<div>Loading...</div>
{:else if !loggedIn}
	<div
		class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800"
	>
		<div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
			<div class="mb-8">
				<div
					class="w-32 h-32 mx-auto bg-purple-200 rounded-full flex items-center justify-center text-purple-600"
				>
					<span class="text-4xl font-bold">LOGO</span>
				</div>
			</div>

			<h1 class="text-4xl font-bold text-purple-800 mb-4">Olympic PropSpot</h1>
			<p class="text-xl text-purple-600 mb-8">Welcome to the Royal Theatre of Props</p>

			<div class="space-y-4">
				<button
					class="w-full bg-gold-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md"
					on:click={() => goto('/login')}
				>
					Log In
				</button>
			</div>

			<p class="mt-8 text-sm text-purple-500">Discover the magic behind the scenes</p>
		</div>
	</div>
{:else}
	<div>
		<h1>Welcome, {user.displayName}</h1>
		<slot />
	</div>
{/if}
