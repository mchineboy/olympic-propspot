<script lang="ts">
    import type { PropAttribute } from '$lib/propsStore';
  
    export let attributes: PropAttribute[] = [];
    
    let newAttribute: PropAttribute = { name: '', value: '' };
  
    function addAttribute() {
      if (newAttribute.name && newAttribute.value) {
        attributes = [...attributes, newAttribute];
        newAttribute = { name: '', value: '' };
      }
    }
  
    function removeAttribute(index: number) {
      attributes = attributes.filter((_, i) => i !== index);
    }
  </script>
  
  <div>
    <h3 class="block mb-2 text-sm font-medium text-purple-700">Additional Attributes</h3>
    {#each attributes as attribute, index}
      <div class="flex items-center mt-2 space-x-2">
        <input type="text" value={attribute.name} readonly 
               id={`attr-name-${index}`}
               aria-label={`Attribute name ${index + 1}`}
               class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
        <input type="text" value={attribute.value} readonly 
               id={`attr-value-${index}`}
               aria-label={`Attribute value ${index + 1}`}
               class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
        <button type="button" on:click={() => removeAttribute(index)} 
                aria-label={`Remove attribute ${index + 1}`}
                class="px-3 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600">
          Remove
        </button>
      </div>
    {/each}
    <div class="flex items-center mt-2 space-x-2">
      <label for="new-attr-name" class="sr-only">New attribute name</label>
      <input type="text" id="new-attr-name" bind:value={newAttribute.name} placeholder="Name" 
             class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
      <label for="new-attr-value" class="sr-only">New attribute value</label>
      <input type="text" id="new-attr-value" bind:value={newAttribute.value} placeholder="Value" 
             class="flex-grow border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
      <button type="button" on:click={addAttribute} 
              class="px-3 py-1 font-bold text-white bg-purple-500 rounded hover:bg-purple-600">
        Add
      </button>
    </div>
  </div>