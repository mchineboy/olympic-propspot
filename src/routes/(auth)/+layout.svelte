<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { initializeAuth, logout } from '$lib/auth.service';
	import { getFirebase } from '$lib/firebase.client';
	import { props } from '$lib/propsStore';
	import Nav from '$components/Nav.svelte';
	import '../../app.css';

	import type { LayoutData } from './$types';
    
	export const data: LayoutData = {
	  getAuthUser: () => Promise.resolve(false),
	  url: ''
	};

	let loading: boolean = true;
	let loggedIn: boolean = false;
	let user: any = null;

	$: ({ loggedIn, user, loading } = $session);

	onMount(() => {
		console.log('Layout mounted');
		initializeAuth().then(() => {
			const unsubscribe = session.subscribe((cur) => {
				loading = cur?.loading;
				loggedIn = cur?.loggedIn;
				user = cur?.user;

				if (loggedIn && user) {
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
				} else if (!loading && !loggedIn) {
					console.log('User not logged in, redirecting to login');
					goto('/login');
				}
			});

			return unsubscribe;
		});
	});

	async function handleLogout() {
		try {
			await logout();
			goto('/login');
		} catch (error) {
			console.error('Logout error:', error);
			// Handle the error appropriately (e.g., show an error message to the user)
		}
	}
</script>

<Nav {loading} {loggedIn} logout={handleLogout} />

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