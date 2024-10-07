<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { initializeAuth, logout } from '$lib/auth.service';
	import { getFirebase } from '$lib/firebase.client';
	import { props } from '$lib/propsStore';
	import Nav from '$components/Nav.svelte';
	import '../../app.css';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

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
		initializeAuth().then(() => {
			const unsubscribe = session.subscribe((cur) => {
				loading = cur?.loading;
				loggedIn = cur?.loggedIn;
				user = cur?.user;

				if (loggedIn && user) {
					const firebase = getFirebase();
					if (firebase) {
						if (!props.isInitialized()) {
							props.init();
						}
					} else {
						console.error('Failed to initialize Firebase');
					}
				} else if (!loading && !loggedIn) {
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
	// ... your existing script code ...

	let loadingProgress = 0;
	let loadingTexts = [
		'Raising the curtain...',
		'Polishing the props...',
		'Warming up the spotlight...',
		'Cueing the music...',
		'Preparing for your grand entrance...'
	];

	$: loadingText = loadingTexts[Math.floor(loadingProgress / 20)];

	if (loading) {
		const interval = setInterval(() => {
			loadingProgress += 1;
			if (loadingProgress >= 100) {
				clearInterval(interval);
			}
		}, 50);
	}
</script>

<Nav {loading} {loggedIn} logout={handleLogout} />

{#if loading}
  <div class="fixed inset-0 z-50 flex items-center justify-center text-yellow-400 bg-purple-900">
    <div class="mx-auto text-center w-72">
      <h1 in:fly="{{ y: 50, duration: 1000, easing: cubicOut }}" class="mb-4 text-4xl font-bold">Olympic PropSpot</h1>
      <div class="relative w-full h-4 mb-4 overflow-hidden bg-purple-700 rounded-full">
        <div 
          class="absolute top-0 left-0 h-full transition-all duration-300 ease-out bg-yellow-400"
          style="width: {loadingProgress}%"
        ></div>
      </div>
      <p in:fade class="text-xl">{loadingText}</p>
    </div>
  </div>
{:else if !loggedIn}
  <div in:fade class="fixed inset-0 z-50 flex items-center justify-center text-yellow-400 bg-purple-900">
    <p class="text-2xl">Redirecting to login...</p>
  </div>
{:else}
  <div in:fade>
    <h1 class="px-8 font-sans text-xs italic text-right text-purple-800">Welcome, {user.displayName}</h1>
    <slot />
  </div>
{/if}

<style>
  @keyframes spotlight {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.2); }
  }

  .bg-purple-900 {
    animation: spotlight 3s infinite;
  }
</style>
