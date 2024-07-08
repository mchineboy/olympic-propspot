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

<head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
</head>

<Nav {loading} {loggedIn} {user} {logout} />

{#if loading}
	<div>Loading...</div>
{:else}
	<div>
		<slot />
	</div>
{/if}
