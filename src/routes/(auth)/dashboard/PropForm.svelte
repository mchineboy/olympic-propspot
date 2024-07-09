<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Prop, PropAttribute } from '$lib/propsStore';
    import { props } from '$lib/propsStore';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import AttributeList from './AttributeList.svelte';
  
    export let prop: Prop | null = null;
  
    const dispatch = createEventDispatcher();
    let imageFile: File | null = null;
    const commonPropTypes = ['Wig', 'Costume', 'Accessory', 'Furniture', 'Electronics', 'Other'];
  
    $: editingProp = prop ? { ...prop } : getEmptyProp();
  
    function getEmptyProp(): Prop {
      return {
        id: '',
        name: '',
        category: '',
        imageUrl: '',
        location: '',
        color: '',
        size: '',
        material: '',
        type: '',
        hairColor: '',
        hairLength: '',
        hairStyle: '',
        attributes: [],
        notes: '',
        tags: [],
      };
    }
  
    async function handleImageUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        imageFile = target.files[0];
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            editingProp.imageUrl = e.target.result;
          }
        };
        reader.readAsDataURL(imageFile);
      }
    }
  
    async function uploadImage(): Promise<string | null> {
      if (!imageFile) return null;
  
      const storage = getStorage();
      const storageRef = ref(storage, 'prop-images/' + Date.now() + '_' + imageFile.name);
      
      try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading image: ", error);
        return null;
      }
    }
  
    async function saveProp() {
      if (imageFile) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          editingProp.imageUrl = imageUrl;
        }
      }
  
      if (editingProp.id) {
        await props.updateProp(editingProp.id, editingProp);
      } else {
        await props.addProp(editingProp);
      }
      dispatch('save');
    }
  
    function cancel() {
      dispatch('cancel');
    }
  
    function handleTagsInput(event: Event) {
      const target = event.target as HTMLInputElement;
      editingProp.tags = target.value.split(',').map((tag: string) => tag.trim());
    }
  </script>
  
  <form on:submit|preventDefault={saveProp} class="space-y-4">
    <div>
      <label for="prop-name" class="block text-sm font-medium text-purple-700">Name</label>
      <input type="text" id="prop-name" bind:value={editingProp.name} required class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-category" class="block text-sm font-medium text-purple-700">Category</label>
      <input type="text" id="prop-category" bind:value={editingProp.category} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-location" class="block text-sm font-medium text-purple-700">Location</label>
      <input type="text" id="prop-location" bind:value={editingProp.location} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-type" class="block text-sm font-medium text-purple-700">Type</label>
      <select id="prop-type" bind:value={editingProp.type} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
        {#each commonPropTypes as type}
          <option value={type}>{type}</option>
        {/each}
        <option value="custom">Custom</option>
      </select>
    </div>
    {#if editingProp.type === 'custom'}
      <div>
        <label for="prop-custom-type" class="block text-sm font-medium text-purple-700">Custom Type</label>
        <input type="text" id="prop-custom-type" bind:value={editingProp.type} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
      </div>
    {/if}
    <div>
      <label for="prop-color" class="block text-sm font-medium text-purple-700">Color</label>
      <input type="text" id="prop-color" bind:value={editingProp.color} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-size" class="block text-sm font-medium text-purple-700">Size</label>
      <input type="text" id="prop-size" bind:value={editingProp.size} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-material" class="block text-sm font-medium text-purple-700">Material</label>
      <input type="text" id="prop-material" bind:value={editingProp.material} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-hair-color" class="block text-sm font-medium text-purple-700">Hair Color</label>
      <input type="text" id="prop-hair-color" bind:value={editingProp.hairColor} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-hair-length" class="block text-sm font-medium text-purple-700">Hair Length</label>
      <input type="text" id="prop-hair-length" bind:value={editingProp.hairLength} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-hair-style" class="block text-sm font-medium text-purple-700">Hair Style</label>
      <input type="text" id="prop-hair-style" bind:value={editingProp.hairStyle} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <AttributeList bind:attributes={editingProp.attributes} />
    <div>
      <label for="prop-notes" class="block text-sm font-medium text-purple-700">Notes</label>
      <textarea id="prop-notes" bind:value={editingProp.notes} class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"></textarea>
    </div>
    <div>
      <label for="prop-tags" class="block text-sm font-medium text-purple-700">Tags (comma-separated)</label>
      <input type="text" id="prop-tags" 
             value={editingProp.tags?.join(', ')} 
             on:input={handleTagsInput}
             class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50">
    </div>
    <div>
      <label for="prop-image" class="block text-sm font-medium text-purple-700">Upload Photo or Take Picture</label>
      <input 
        type="file" 
        id="prop-image" 
        accept="image/*" 
        capture="environment"
        on:change={handleImageUpload}
        class="block w-full mt-1 text-sm text-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      >
    </div>
    {#if editingProp.imageUrl}
      <div class="mt-2">
        <img src={editingProp.imageUrl} alt="Prop preview" class="h-auto max-w-full rounded-lg shadow-md">
      </div>
    {/if}
    <div class="flex justify-between pt-4">
      <button type="submit" class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700">
        Save
      </button>
      <button type="button" on:click={cancel} class="px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400">
        Cancel
      </button>
    </div>
  </form>