<script lang="ts">
    import type { Prop } from '$lib/propsStore';
    import { createEventDispatcher } from 'svelte';
    import { props } from '$lib/propsStore';
  
    export let prop: Prop;
    
    const dispatch = createEventDispatcher<{edit: Prop}>();
  
    function editProp() {
      dispatch('edit', prop);
    }
  
    async function deleteProp() {
      if (confirm('Are you sure you want to delete this prop?')) {
        await props.deleteProp(prop.id);
      }
    }
  </script>
  
  <div class="p-6 bg-white border border-purple-200 rounded-lg shadow-md">
    {#if prop.imageUrl}
      <img src={prop.imageUrl} alt={prop.name} class="object-cover w-full h-48 mb-4 rounded-md">
    {/if}
    <h3 class="mb-2 text-xl font-semibold text-purple-800">{prop.name}</h3>
    <p class="mb-1 text-purple-600">Type: {prop.type}</p>
    <p class="mb-1 text-purple-600">Category: {prop.category}</p>
    <p class="mb-4 text-purple-600">Location: {prop.location}</p>
    <div class="flex justify-between">
      <button on:click={editProp} class="px-3 py-1 font-bold text-white rounded bg-gold-500 hover:bg-gold-600">
        Edit
      </button>
      <button on:click={deleteProp} class="px-3 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600">
        Delete
      </button>
    </div>
  </div>