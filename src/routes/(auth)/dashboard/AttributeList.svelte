<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { PropAttribute } from '$lib/propsStore';
  
  export let attributes: PropAttribute[] = [];
  
  const dispatch = createEventDispatcher<{change: PropAttribute[]}>();
  
  let newAttribute: PropAttribute = { name: '', value: '' };

  function addAttribute() {
    if (newAttribute.name && newAttribute.value) {
      attributes = [...attributes, { ...newAttribute }];
      newAttribute = { name: '', value: '' };
      dispatch('change', attributes);
    }
  }

  function removeAttribute(index: number) {
    attributes = attributes.filter((_, i) => i !== index);
    dispatch('change', attributes);
  }

  function updateAttribute(index: number, field: 'name' | 'value', value: string) {
    attributes[index][field] = value;
    attributes = [...attributes];
    dispatch('change', attributes);
  }
</script>

<div>
  <h3 class="block mb-2 text-sm font-medium text-purple-700">Additional Attributes</h3>
  {#each attributes as attribute, index}
    <div class="flex items-center mt-2 space-x-2">
      <input 
        type="text" 
        value={attribute.name}
        on:input={(e) => updateAttribute(index, 'name', e.currentTarget.value)}
        aria-label={`Attribute name ${index + 1}`}
        class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
      <input 
        type="text" 
        value={attribute.value}
        on:input={(e) => updateAttribute(index, 'value', e.currentTarget.value)}
        aria-label={`Attribute value ${index + 1}`}
        class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
      <button 
        type="button" 
        on:click={() => removeAttribute(index)}
        aria-label={`Remove attribute ${index + 1}`}
        class="px-3 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  {/each}
  <div class="flex items-center mt-2 space-x-2">
    <input 
      type="text" 
      bind:value={newAttribute.name} 
      placeholder="Name" 
      aria-label="New attribute name"
      class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    />
    <input 
      type="text" 
      bind:value={newAttribute.value} 
      placeholder="Value" 
      aria-label="New attribute value"
      class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    />
    <button 
      type="button" 
      on:click={addAttribute}
      class="px-3 py-1 font-bold text-white bg-purple-500 rounded hover:bg-purple-600"
    >
      Add
    </button>
  </div>
</div>