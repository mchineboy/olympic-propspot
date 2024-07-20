<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let images: string[] = [];
    export let maxImages: number = 5;
    export let ariaLabel: string = 'Image Upload';
  
    const dispatch = createEventDispatcher();
  
    let fileInput: HTMLInputElement;
  
    function triggerFileInput() {
      fileInput.click();
    }
  
    function handleFileSelect(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        handleFiles(target.files);
      }
    }
  
    function handleFiles(files: FileList) {
      for (let i = 0; i < files.length; i++) {
        if (images.length >= maxImages) break;
        
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
              images = [...images, e.target.result];
              dispatch('change', images);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  
    function removeImage(index: number) {
      images = images.filter((_, i) => i !== index);
      dispatch('change', images);
    }
  </script>
  
  <div class="mb-4">
    <div class="flex flex-wrap gap-2 mb-4">
      {#each images as image, index}
        <div class="relative w-20 h-20">
          <img src={image} alt="Uploaded preview" class="object-cover w-full h-full rounded-md" />
          <button 
            class="absolute flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-red-500 rounded-full -top-2 -right-2"
            on:click={() => removeImage(index)}
          >
            ×
          </button>
        </div>
      {/each}
    </div>
  
    {#if images.length < maxImages}
      <div class="flex gap-2">
        <button 
          class="flex items-center justify-center flex-1 px-4 py-2 font-bold text-white transition duration-300 bg-purple-600 rounded-md hover:bg-purple-700"
          on:click={triggerFileInput}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Take Photo
        </button>
        <button 
          class="flex items-center justify-center flex-1 px-4 py-2 font-bold text-white transition duration-300 bg-purple-600 rounded-md hover:bg-purple-700"
          on:click={triggerFileInput}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Choose from Gallery
        </button>
      </div>
    {/if}
  
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      on:change={handleFileSelect}
      class="hidden"
      multiple
      aria-labelledby={ariaLabel}
    />
  </div>