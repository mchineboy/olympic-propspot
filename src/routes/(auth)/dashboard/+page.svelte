<script lang="ts">
    import { onMount } from 'svelte';
    import { props } from '$lib/propsStore';
    import type { Prop } from '$lib/propsStore';
    import InfiniteScroll from 'svelte-infinite-scroll';
  
    let allProps: Prop[] = [];
    let displayedProps: Prop[] = [];
    let sortOption = 'created-desc';
    let isAddDialogOpen = false;
    let page = 0;
    const pageSize = 20;
  
    const commonPropTypes = ['Wig', 'Costume', 'Accessory', 'Furniture', 'Electronics', 'Other'];
  
    function getEmptyProp(): Prop {
      return {
        id: '',
        name: '',
        type: '',
        category: '',
        color: '',
        size: '',
        material: '',
        notes: '',
        tags: [],
      };
    }
  
    let editingProp: Prop = getEmptyProp();
  
    $: {
      allProps = $props;
      sortProps();
      loadMoreProps();
    }
  
    function sortProps() {
      switch (sortOption) {
        case 'created-desc':
          allProps.sort((a, b) => (b.created?.toMillis() ?? 0) - (a.created?.toMillis() ?? 0));
          break;
        case 'created-asc':
          allProps.sort((a, b) => (a.created?.toMillis() ?? 0) - (b.created?.toMillis() ?? 0));
          break;
        case 'name-asc':
          allProps.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
          break;
        case 'name-desc':
          allProps.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''));
          break;
      }
      page = 0;
      displayedProps = [];
      loadMoreProps();
    }
  
    function loadMoreProps() {
      const newProps = allProps.slice(page * pageSize, (page + 1) * pageSize);
      displayedProps = [...displayedProps, ...newProps];
      page++;
    }
  
    function openAddDialog() {
      editingProp = getEmptyProp();
      isAddDialogOpen = true;
    }
  
    function openEditDialog(prop: Prop) {
      editingProp = { ...getEmptyProp(), ...prop };
      isAddDialogOpen = true;
    }
  
    async function deleteProp(id: string) {
      if (confirm('Are you sure you want to delete this prop?')) {
        await props.deleteProp(id);
      }
    }
  
    async function saveProp() {
      if (editingProp.id) {
        await props.updateProp(editingProp.id, editingProp);
      } else {
        await props.addProp(editingProp);
      }
      isAddDialogOpen = false;
      editingProp = getEmptyProp();
    }
  
    function handleTagsInput(event: Event) {
      const target = event.target as HTMLInputElement;
      editingProp.tags = target.value.split(',').map((tag: string) => tag.trim());
    }
  
    onMount(() => {
      if (!props.isInitialized()) {
        props.init();
      }
    });
  </script>
  
  <main class="container px-4 py-8 mx-auto">
    <h1 class="mb-8 text-4xl font-bold text-purple-800">Props Dashboard</h1>
    
    <div class="flex items-center justify-between mb-6">
      <select bind:value={sortOption} on:change={sortProps} class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5">
        <option value="created-desc">Newest First</option>
        <option value="created-asc">Oldest First</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
      <button on:click={openAddDialog} class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700">
        Add New Prop
      </button>
    </div>
  
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each displayedProps as prop (prop.id)}
        <div class="p-6 bg-white border border-purple-200 rounded-lg shadow-md">
          <h3 class="mb-2 text-xl font-semibold text-purple-800">{prop.name}</h3>
          <p class="mb-1 text-purple-600">Type: {prop.type}</p>
          <p class="mb-4 text-purple-600">Category: {prop.category}</p>
          <div class="flex justify-between">
            <button on:click={() => openEditDialog(prop)} class="px-3 py-1 font-bold text-white rounded bg-gold-500 hover:bg-gold-600">
              Edit
            </button>
            <button on:click={() => deleteProp(prop.id)} class="px-3 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      {/each}
      <InfiniteScroll threshold={100} on:loadMore={loadMoreProps} />
    </div>
  
    {#if isAddDialogOpen}
      <div class="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <h2 class="mb-6 text-2xl font-bold text-purple-800">{editingProp.id ? 'Edit Prop' : 'Add New Prop'}</h2>
          <form on:submit|preventDefault={saveProp} class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-purple-700">Name</label>
              <input type="text" id="name" bind:value={editingProp.name} required class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
            </div>
            <div>
              <label for="type" class="block text-sm font-medium text-purple-700">Type</label>
              <select id="type" bind:value={editingProp.type} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
                {#each commonPropTypes as type}
                  <option value={type}>{type}</option>
                {/each}
                <option value="custom">Custom</option>
              </select>
            </div>
            {#if editingProp.type === 'custom'}
              <div>
                <label for="customType" class="block text-sm font-medium text-purple-700">Custom Type</label>
                <input type="text" id="customType" bind:value={editingProp.type} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
              </div>
            {/if}
            <div>
              <label for="category" class="block text-sm font-medium text-purple-700">Category</label>
              <input type="text" id="category" bind:value={editingProp.category} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
            </div>
            <div>
              <label for="color" class="block text-sm font-medium text-purple-700">Color</label>
              <input type="text" id="color" bind:value={editingProp.color} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
            </div>
            <div>
              <label for="size" class="block text-sm font-medium text-purple-700">Size</label>
              <input type="text" id="size" bind:value={editingProp.size} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
            </div>
            <div>
              <label for="material" class="block text-sm font-medium text-purple-700">Material</label>
              <input type="text" id="material" bind:value={editingProp.material} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
            </div>
            <div>
              <label for="notes" class="block text-sm font-medium text-purple-700">Notes</label>
              <textarea id="notes" bind:value={editingProp.notes} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"></textarea>
            </div>
            <div>
              <label for="tags" class="block text-sm font-medium text-purple-700">Tags (comma-separated)</label>
              <input type="text" id="tags" 
                     value={editingProp.tags?.join(', ')} 
                     on:input={handleTagsInput}
                     class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
            </div>
            <div class="flex justify-between pt-4">
              <button type="submit" class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700">
                Save
              </button>
              <button type="button" on:click={() => isAddDialogOpen = false} class="px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    {/if}
  </main>