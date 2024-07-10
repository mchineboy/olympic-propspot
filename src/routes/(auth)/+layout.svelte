<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { getFirebase } from '$lib/firebase.client';
	import { props } from '$lib/propsStore';
	import Nav from '$components/Nav.svelte';
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
		console.log('Layout mounted');
		const user: any = await data.getAuthUser();
		console.log('Auth user:', user);

		const loggedIn = !!user && user?.emailVerified;
		console.log('User logged in:', loggedIn);

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
			console.log('Attempting to initialize Firebase');
			const firebase = getFirebase();
			if (firebase) {
				console.log('Firebase initialized successfully');
				if (!props.isInitialized()) {
					console.log('Initializing props store');
					props.init();
				} else {
					console.log('Props store already initialized');
				}
			} else {
				console.error('Failed to initialize Firebase');
			}
		} else {
			console.log('User not logged in, redirecting to login');
			goto('/login');
		}
	});

	async function logout() {
		try {
			const firebase = getFirebase();
			if (!firebase) {
				throw new Error('Firebase is not initialized');
			}
			const { auth } = firebase;
			await signOut(auth);
			goto('/login');
			loggedIn = false;
		} catch (error) {
			console.error('Logout error:', error);
			// Handle the error appropriately (e.g., show an error message to the user)
		}
	}
</script>

<Nav {loading} {loggedIn} {logout} />

{#if loading}
	<div>Loading...</div>
{:else if !loggedIn}
	<div>Redirecting to login...</div>
{:else}
	<div>
		<h1 class="px-8 font-sans text-xs italic text-right">Welcome, {user.displayName}</h1>
		<slot />
	</div>
{/if}
