<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Prop, PropAttribute } from '$lib/propsStore';
  import { props } from '$lib/propsStore';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import AttributeList from './AttributeList.svelte';

  export let prop: Prop | null = null;
  export let canCreate: boolean = false;
  export let canUpdate: boolean = false;

  const dispatch = createEventDispatcher();
  let imageFile: File | null = null;
  let error: string | null = null;
  let isLoading = false;

  const categories = [
    'Clothing',
    'Furniture',
    'Accessories',
    'Electronics',
    'Wigs',
    'Other'
  ] as const;
  type Category = (typeof categories)[number];

  const types: Record<Category, string[]> = {
    Clothing: ['Shirt', 'Pants', 'Dress', 'Jacket', 'Costume', 'Other'],
    Furniture: ['Chair', 'Table', 'Sofa', 'Bed', 'Prop Furniture', 'Other'],
    Accessories: ['Jewelry', 'Hat', 'Scarf', 'Bag', 'Prop Accessory', 'Other'],
    Electronics: ['Phone', 'Camera', 'Microphone', 'Lighting', 'Other'],
    Wigs: ['Short', 'Medium', 'Long', 'Styled', 'Other'],
    Other: ['Custom']
  };

  $: editingProp = prop ? { ...prop } : getEmptyProp();
  $: availableTypes =
    editingProp.category && editingProp.category in types
      ? types[editingProp.category as Category]
      : [];
  $: isWig = editingProp.category === 'Wigs';

  function getEmptyProp(): Prop {
    return {
      id: '',
      name: '',
      category: undefined,
      type: '',
      imageUrl: '',
      location: '',
      color: '',
      size: '',
      material: '',
      hairColor: '',
      hairLength: '',
      hairStyle: '',
      attributes: [],
      notes: '',
      tags: []
    };
  }

  function handleCategoryChange() {
    if (editingProp.category && editingProp.category in types) {
      const categoryTypes = types[editingProp.category as Category];
      if (editingProp.type && !categoryTypes.includes(editingProp.type)) {
        editingProp.type = categoryTypes[0];
      }
    } else {
      editingProp.type = '';
    }
  }

  let useCamera = false;
  let imagePreviewUrl: string | null = null;

  async function handleImageUpload(event: Event) {
    error = null;
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        error = 'File size exceeds 5MB limit.';
        return;
      }
      imageFile = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          imagePreviewUrl = e.target.result;
        }
      };
      reader.onerror = () => {
        error = 'Failed to read the image file.';
      };
      reader.readAsDataURL(imageFile);
    }
  }

  async function saveProp() {
    error = null;
    isLoading = true;
    try {
      if (!canCreate && !canUpdate) {
        throw new Error('You do not have permission to perform this action.');
      }

      let imageUrl: string | undefined | null = editingProp.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
      }

      const propToSave = {
        ...editingProp,
        imageUrl: imageUrl
      };

      // Remove imagePreviewUrl before saving to Firestore
      delete propToSave.imagePreviewUrl;

      if (propToSave.id) {
        if (!canUpdate) {
          throw new Error('You do not have permission to update props.');
        }
        await props.updateProp(propToSave.id, propToSave);
      } else {
        if (!canCreate) {
          throw new Error('You do not have permission to create new props.');
        }
        await props.addProp(propToSave);
      }
      dispatch('save');
    } catch (err) {
      console.error('Error saving prop: ', err);
      error = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      isLoading = false;
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
    } catch (err) {
      console.error('Error uploading image: ', err);
      throw err;
    }
  }

  function cancel() {
    dispatch('cancel');
  }

  function toggleCamera() {
    useCamera = !useCamera;
  }

  function handleTagsInput(event: Event) {
    const target = event.target as HTMLInputElement;
    editingProp.tags = target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean);
  }
</script>

<form on:submit|preventDefault={saveProp} class="space-y-4">
  {#if error}
    <div
      class="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
      role="alert"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}

  <div>
    <label for="prop-name" class="block text-sm font-medium text-purple-700">Name</label>
    <input
      type="text"
      id="prop-name"
      bind:value={editingProp.name}
      required
      class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    />
  </div>

  <div>
    <label for="prop-category" class="block text-sm font-medium text-purple-700">Category</label>
    <select
      id="prop-category"
      bind:value={editingProp.category}
      on:change={handleCategoryChange}
      class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    >
      <option value="">Select a category</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>

  {#if editingProp.category}
    <div>
      <label for="prop-type" class="block text-sm font-medium text-purple-700">Type</label>
      <select
        id="prop-type"
        bind:value={editingProp.type}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      >
        <option value="">Select a type</option>
        {#each availableTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </div>
  {/if}

  {#if editingProp.type === 'Other' || editingProp.type === 'Custom'}
    <div>
      <label for="prop-custom-type" class="block text-sm font-medium text-purple-700">Custom Type</label>
      <input
        type="text"
        id="prop-custom-type"
        bind:value={editingProp.type}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
    </div>
  {/if}

  <div>
    <label for="prop-location" class="block text-sm font-medium text-purple-700">Location</label>
    <input
      type="text"
      id="prop-location"
      bind:value={editingProp.location}
      class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    />
  </div>

  {#if !isWig}
    <div>
      <label for="prop-color" class="block text-sm font-medium text-purple-700">Color</label>
      <input
        type="text"
        id="prop-color"
        bind:value={editingProp.color}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
    </div>

    <div>
      <label for="prop-size" class="block text-sm font-medium text-purple-700">Size</label>
      <input
        type="text"
        id="prop-size"
        bind:value={editingProp.size}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
    </div>

    <div>
      <label for="prop-material" class="block text-sm font-medium text-purple-700">Material</label>
      <input
        type="text"
        id="prop-material"
        bind:value={editingProp.material}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
    </div>
  {/if}

  {#if isWig}
    <div>
      <label for="prop-hair-color" class="block text-sm font-medium text-purple-700">Hair Color</label>
      <input
        type="text"
        id="prop-hair-color"
        bind:value={editingProp.hairColor}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
    </div>

    <div>
      <label for="prop-hair-length" class="block text-sm font-medium text-purple-700">Hair Length</label>
      <input
        type="text"
        id="prop-hair-length"
        bind:value={editingProp.hairLength}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
    </div>

    <div>
      <label for="prop-hair-style" class="block text-sm font-medium text-purple-700">Hair Style</label>
      <input
        type="text"
        id="prop-hair-style"
        bind:value={editingProp.hairStyle}
        class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      />
    </div>
  {/if}

  <AttributeList bind:attributes={editingProp.attributes} />

  <div>
    <label for="prop-notes" class="block text-sm font-medium text-purple-700">Notes</label>
    <textarea
      id="prop-notes"
      bind:value={editingProp.notes}
      class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    ></textarea>
  </div>

  <div>
    <label for="prop-tags" class="block text-sm font-medium text-purple-700">Tags (comma-separated)</label>
    <input
      type="text"
      id="prop-tags"
      value={editingProp.tags?.join(', ')}
      on:input={handleTagsInput}
      class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
    />
  </div>

  <div>
    <label for="prop-image" class="block text-sm font-medium text-purple-700">Upload Photo or Take Picture</label>
    <div class="flex items-center space-x-2">
      <input
        type="file"
        id="prop-image"
        accept="image/*"
        capture={useCamera ? 'environment' : undefined}
        on:change={handleImageUpload}
        class="block w-full mt-1 text-sm text-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      />
      <button
        type="button"
        on:click={toggleCamera}
        class="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md"
      >
        {useCamera ? 'Use File Upload' : 'Use Camera'}
      </button>
    </div>
  </div>

  {#if imagePreviewUrl || editingProp.imageUrl}
    <div class="mt-2">
      <img
        src={imagePreviewUrl || editingProp.imageUrl}
        alt="Prop preview"
        class="h-auto max-w-full rounded-lg shadow-md"
      />
    </div>
  {/if}

  <div class="flex justify-between pt-4">
    <button
      type="submit"
      class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700"
      disabled={isLoading || (!canCreate && !canUpdate)}
    >
      {isLoading ? 'Saving...' : 'Save'}
    </button>
    <button
      type="button"
      on:click={cancel}
      class="px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
      disabled={isLoading}
    >
      Cancel
    </button>
  </div>
</form>
