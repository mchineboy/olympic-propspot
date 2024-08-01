<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let images: string[] = [];
  export let ariaLabel: string = '';
  export let id: string = '';

  const dispatch = createEventDispatcher<{change: string[]}>();

  let fileInput: HTMLInputElement;

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === 'string') {
            images = [...images, e.target.result];
            dispatch('change', images);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
    dispatch('change', images);
  }
</script>

<div>
  <input
    type="file"
    accept="image/*"
    multiple
    on:change={handleFileSelect}
    class="hidden"
    bind:this={fileInput}
    {id}
    aria-label={ariaLabel}
  />
  <button
    type="button"
    on:click={() => fileInput.click()}
    class="px-4 py-2 mb-4 font-bold text-white bg-purple-500 rounded hover:bg-purple-700"
  >
    Add Images
  </button>
  
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
    {#each images as image, index}
      <div class="relative">
        <img src={image} alt="Selected prop" class="object-cover w-full h-32 rounded" />
        <button
          type="button"
          on:click={() => removeImage(index)}
          class="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full hover:bg-red-700"
          aria-label="Remove image"
        >
          X
        </button>
      </div>
    {/each}
  </div>
</div>