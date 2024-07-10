<script lang="ts">
  import { props } from '$lib/propsStore';
  import type { Prop } from '$lib/propsStore';
  import PropList from './PropList.svelte';
  import PropForm from './PropForm.svelte';
  import { onMount } from 'svelte';

  let allProps: Prop[] = [];
  let sortOption = 'lastUsed-desc';
  let isAddDialogOpen = false;
  let editingProp: Prop | null = null;

  $: {
    allProps = $props;
    console.log('Updated allProps:', allProps); // Add this line
    sortProps();
  }

  onMount(() => {
    console.log('Component mounted');
  });

  function sortProps() {
    switch (sortOption) {
      case 'lastUsed-desc':
        allProps.sort((a, b) => (b.lastUsed?.toMillis() ?? 0) - (a.lastUsed?.toMillis() ?? 0));
        break;
      case 'lastUsed-asc':
        allProps.sort((a, b) => (a.lastUsed?.toMillis() ?? 0) - (b.lastUsed?.toMillis() ?? 0));
        break;
      case 'name-asc':
        allProps.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
        break;
      case 'name-desc':
        allProps.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''));
        break;
    }
  }

  function openAddDialog() {
    editingProp = null;
    isAddDialogOpen = true;
  }

  function openEditDialog(event: CustomEvent<Prop>) {
    editingProp = event.detail;
    isAddDialogOpen = true;
  }

  function closeDialog() {
    isAddDialogOpen = false;
    editingProp = null;
  }
</script>

<main class="container px-4 py-8 mx-auto">
  <h1 class="mb-8 text-4xl font-bold text-purple-800">Props Dashboard</h1>
  
  <div class="flex items-center justify-between mb-6">
    <select bind:value={sortOption} on:change={sortProps} class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5">
      <option value="lastUsed-desc">Last Used (Newest First)</option>
      <option value="lastUsed-asc">Last Used (Oldest First)</option>
      <option value="name-asc">Name (A-Z)</option>
      <option value="name-desc">Name (Z-A)</option>
    </select>
    <button on:click={openAddDialog} class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700">
      Add New Prop
    </button>
  </div>

  <PropList props={allProps} on:edit={openEditDialog} />

  {#if isAddDialogOpen}
    <div class="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <PropForm prop={editingProp} on:save={closeDialog} on:cancel={closeDialog} />
      </div>
    </div>
  {/if}
</main>