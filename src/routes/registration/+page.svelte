<script lang="ts">
    import { registerWithEmailAndPassword, registerWithGoogle } from './auth';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { getFirebase, waitForAuth } from '$lib/firebase.client';
  
    let email = '';
    let password = '';
    let confirmPassword = '';
    let name = '';
    let errorMessage = '';
    let successMessage = '';
  
    onMount(async () => {
      const firebase = getFirebase();
      if (!firebase) {
        errorMessage = 'Firebase initialization failed';
        return;
      }
  
      const user = await waitForAuth();
      if (user) {
        // User is already logged in, redirect to appropriate page
        goto('/dashboard');
      }
    });
  
    async function handleEmailRegistration() {
      if (password !== confirmPassword) {
        errorMessage = 'Passwords do not match';
        return;
      }
  
      try {
        await registerWithEmailAndPassword(email, password, name);
        successMessage = 'Registration successful! Please wait for admin approval.';
        errorMessage = '';
        // Optionally, redirect to a "waiting for approval" page
        // goto('/waiting-approval');
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        successMessage = '';
      }
    }
  
    async function handleGoogleRegistration() {
      try {
        await registerWithGoogle();
        successMessage = 'Registration successful! Please wait for admin approval.';
        errorMessage = '';
        // Optionally, redirect to a "waiting for approval" page
        // goto('/waiting-approval');
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        successMessage = '';
      }
    }
  </script>
  
  
  <div class="max-w-md p-6 mx-auto mt-8 bg-white rounded-lg shadow-md">
    <h1 class="mb-6 text-2xl font-bold text-center text-gray-800">Register for PropSpot</h1>
    
    {#if errorMessage}
      <div class="relative px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
        <span class="block sm:inline">{errorMessage}</span>
      </div>
    {/if}
    
    {#if successMessage}
      <div class="relative px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded" role="alert">
        <span class="block sm:inline">{successMessage}</span>
      </div>
    {/if}
  
    <form on:submit|preventDefault={handleEmailRegistration} class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" id="name" bind:value={name} required class="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
  
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" bind:value={email} required class="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
  
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="password" bind:value={password} required class="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
  
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input type="password" id="confirmPassword" bind:value={confirmPassword} required class="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
  
      <button type="submit" class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Register
      </button>
    </form>
  
    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 text-gray-500 bg-white">Or continue with</span>
        </div>
      </div>
  
      <div class="mt-6">
        <button on:click={handleGoogleRegistration} class="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.836 0 10.998-8.223 10.998-13.334 0-0.756-0.064-1.498-0.192-2.192h-10.806z"/>
          </svg>
          Register with Google
        </button>
      </div>
    </div>
  
    <p class="mt-8 text-sm text-center text-gray-600">
      Already have an account? 
      <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
        Log in
      </a>
    </p>
  </div>