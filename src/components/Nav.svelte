<script lang="ts">
    import { session, type User } from '$lib/session';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
  
    let isLoggedIn: boolean | undefined = false;
    let user: User | null;
    let isMenuOpen: boolean = false;
  
    onMount(() => {
      const unsubscribe = session.subscribe(sessionData => {
        isLoggedIn = sessionData.loggedIn;
        user = sessionData.user;
      });
  
      return unsubscribe;
    });
  
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
    }
    
  </script>
  
  <nav class="bg-purple-900 shadow-lg">
    <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex items-center flex-shrink-0">
          <img class="w-auto h-8" src="/path-to-your-logo.svg" alt="Logo">
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center">
          <button class="p-2 text-yellow-300 rounded-full hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-900 focus:ring-white">
            <span class="sr-only">Search</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {#if isLoggedIn && user}
            <div class="relative ml-3">
              <div>
                <button on:click={toggleMenu} class="flex text-sm bg-purple-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-900 focus:ring-white">
                  <span class="sr-only">Open user menu</span>
                  {#if user.photoURL}
                    <img class="w-8 h-8 rounded-full" src={user.photoURL} alt={user.displayName || 'User avatar'}>
                  {:else}
                    <div class="flex items-center justify-center w-8 h-8 font-bold text-purple-900 bg-yellow-300 rounded-full">
                      {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                  {/if}
                </button>
              </div>
              {#if isMenuOpen}
                <div transition:fade={{ duration: 100 }} class="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                  <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a href="/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                </div>
              {/if}
            </div>
          {:else}
            <a href="/login" class="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-purple-900 bg-yellow-300 border border-transparent rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              Login
            </a>
          {/if}
          <button class="p-2 ml-3 text-yellow-300 rounded-full hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-900 focus:ring-white">
            <span class="sr-only">Settings</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>