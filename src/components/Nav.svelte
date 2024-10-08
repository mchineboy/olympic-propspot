<script lang="ts">
	import { fade } from 'svelte/transition';
	import { session, defaultSession } from '$lib/session';
    import { goto } from '$app/navigation';

    function navigateToAdmin() {
        goto('/admin');
    }

	export let loading: boolean;
	export let loggedIn: boolean;
	export let logout: () => void;

	let isMenuOpen: boolean = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	$: sessionData = $session || defaultSession;
	$: user = sessionData.user;
</script>

<nav class="bg-purple-900 shadow-lg">
	<div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="relative flex items-center justify-between h-16">
			<div class="flex items-center flex-shrink-0">
				<a href="/" class="flex items-center">
					<span class="sr-only">Olympic PropSpot</span>
					<img
						class="w-auto h-8"
						src="/images/olympic-propspot-high-resolution-logo-white-transparent.svg"
						alt="Logo"
					/>
				</a>
			</div>

			<div class="flex-1"></div>

			<div class="flex items-center">
				{#if loading && !loggedIn}
					<div class="ml-3 text-yellow-300">Loading...</div>
				{:else if loggedIn && user}
					
					<div class="relative ml-3">
						<div>
							<button
								on:click={toggleMenu}
								class="flex text-sm bg-purple-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-900 focus:ring-white"
							>
								<span class="sr-only">Open user menu</span>
								{#if $session.user}
									<img
										class="w-8 h-8 rounded-full"
										src={$session.user?.photoURL}
										alt={$session.user?.displayName || 'User avatar'}
									/>
								{:else}
									<div
										class="flex items-center justify-center w-8 h-8 font-bold text-purple-900 bg-yellow-300 rounded-full"
									>
										{#if user.displayName}
											{user.displayName[0].toUpperCase()}
										{:else if user.email}
											{user.email[0].toUpperCase()}
										{:else}
											U
										{/if}
									</div>
								{/if}
							</button>
						</div>
						{#if isMenuOpen}
							<div
								transition:fade={{ duration: 100 }}
								class="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							>
								<a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>Your Profile</a
								>
								{#if sessionData.user?.administrator}
									<a href="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>Admin</a
									>
								{/if}
							</div>
							<button
								on:click={logout}
								class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
							>
								Sign out
							</button>
						{/if}
					</div>
					{#if sessionData.user?.administrator}
						<button
							class="p-2 ml-3 text-yellow-300 rounded-full hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-900 focus:ring-white"
							on:click={navigateToAdmin}
						>
							<span class="sr-only">Settings</span>
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</button>
					{/if}
				{:else}
					<a
						href="/login"
						class="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-purple-900 bg-yellow-300 border border-transparent rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
					>
						Login
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
