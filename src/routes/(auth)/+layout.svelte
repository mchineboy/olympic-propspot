<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { initializeAuth, logout } from '$lib/auth.service';
	import { getFirebase } from '$lib/firebase.client';
	import { props } from '$lib/propsStore';
	import Nav from '$components/Nav.svelte';
	import '../../app.css';
	import { fade, fly, scale } from 'svelte/transition';
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

	let loadingProgress = 0;
	let loadingComplete = false;
	let curtainOpen = false;
	let loadingTexts = [
		'Raising the curtain...',
		'Polishing the props...',
		'Warming up the spotlight...',
		'Cueing the music...',
		'Preparing for your grand entrance...'
	];

	$: loadingText = loadingTexts[Math.floor(loadingProgress / 20)];

	$: if (loading) {
		const interval = setInterval(() => {
			loadingProgress += 1;
			if (loadingProgress >= 100) {
				clearInterval(interval);
				loadingComplete = true;
				setTimeout(() => {
					curtainOpen = true;
				}, 500); // Delay before opening the curtain
			}
		}, 50);
	}
</script>

<Nav {loading} {loggedIn} logout={handleLogout} />

{#if loading || loadingComplete}
  <div class="fixed inset-0 z-50 flex items-center justify-center text-yellow-400 bg-purple-900">
    <div class="mx-auto text-center w-72">
      <h1 in:fly="{{ y: 50, duration: 1000, easing: cubicOut }}" class="mb-4 text-4xl font-bold">Olympic PropSpot</h1>
      {#if !loadingComplete}
        <div class="relative w-full h-4 mb-4 overflow-hidden bg-purple-700 rounded-full">
          <div 
            class="absolute top-0 left-0 h-full transition-all duration-300 ease-out bg-yellow-400"
            style="width: {loadingProgress}%"
          ></div>
        </div>
        <p in:fade class="text-xl">{loadingText}</p>
      {:else}
        <p in:scale class="text-2xl">Welcome to the show!</p>
      {/if}
    </div>
  </div>
{/if}

{#if curtainOpen}
  <div 
    class="curtain-left"
    out:fly="{{ x: -window.innerWidth/2, duration: 1000, easing: cubicOut }}"
  ></div>
  <div 
    class="curtain-right"
    out:fly="{{ x: window.innerWidth/2, duration: 1000, easing: cubicOut }}"
  ></div>
{/if}

{#if !loading && loggedIn}
  <div in:fade>
    <h1 class="px-8 font-sans text-xs italic text-right text-purple-800">Welcome, {user.displayName}</h1>
    <slot />
  </div>
{:else if !loading && !loggedIn}
  <div in:fade class="fixed inset-0 z-50 flex items-center justify-center text-yellow-400 bg-purple-900">
    <p class="text-2xl">Redirecting to login...</p>
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

  .curtain-left, .curtain-right {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 50%;
    background-color: #4C1D95;
    z-index: 60;
  }

  .curtain-left {
    left: 0;
  }

  .curtain-right {
    right: 0;
  }
</style>