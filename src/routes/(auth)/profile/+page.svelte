<script lang="ts">
import { onMount } from 'svelte';
import { session } from '$lib/session';
import { prefs, type UserPreferences } from '$lib/prefsStore';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

let defaultPropType = 'All';
let isSaving = false;
let message = '';
let unsubscribe: (() => void) | undefined;

const propTypes = [
    'All',
    'Clothing',
    'Furniture',
    'Accessories',
    'Electronics',
    'Wigs',
    'Other'
];

onMount(() => {
    const initPrefs = async () => {
        const sessionData = get(session);
        if (!sessionData.loggedIn) {
            goto('/login');
            return;
        }

        if (sessionData.user) {
            const userPrefs = await prefs.getUserPrefs(sessionData.user.uid);
            if (userPrefs) {
                defaultPropType = userPrefs.defaultPropType || 'All';
            }

            // Initialize the store
            unsubscribe = prefs.init(sessionData.user.uid);
        }
    };

    initPrefs();

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
});

async function savePreferences() {
    isSaving = true;
    message = '';

    const sessionData = get(session);
    if (!sessionData.user) {
        message = 'User not logged in';
        isSaving = false;
        return;
    }

    try {
        await prefs.setUserPrefs(sessionData.user.uid, { defaultPropType });
        message = 'Preferences saved successfully!';
    } catch (error) {
        console.error('Error saving preferences:', error);
        message = 'Error saving preferences. Please try again.';
    }

    isSaving = false;
}

</script>

<main class="container px-4 py-8 mx-auto">
    <h1 class="mb-8 text-4xl font-bold text-purple-800">User Preferences</h1>

    <form on:submit|preventDefault={savePreferences} class="max-w-md space-y-4">
        <div>
            <label for="defaultPropType" class="block text-sm font-medium text-purple-700">
                Default Property Type View
            </label>
            <select 
                id="defaultPropType"
                bind:value={defaultPropType}
                class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            >
                {#each propTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </div>

        <button 
            type="submit" 
            class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={isSaving}
        >
            {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>

        {#if message}
            <p class="text-sm text-purple-600">{message}</p>
        {/if}
    </form>
</main>