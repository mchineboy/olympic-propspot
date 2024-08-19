<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Prop } from '$lib/propsStore';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	export let prop: Prop;
	export let show: boolean = false;

	const dispatch = createEventDispatcher();

	let currentImageIndex = 0;

	$: images =
		prop.imageUrls && prop.imageUrls.length > 0
			? prop.imageUrls
			: prop.imageUrl
				? [prop.imageUrl]
				: [];

	function closeModal() {
		dispatch('close');
	}

	function nextImage() {
		if (currentImageIndex < images.length - 1) {
			currentImageIndex++;
		}
	}

	function prevImage() {
		if (currentImageIndex > 0) {
			currentImageIndex--;
		}
	}

	// Function to disable background scrolling
	function disableBackgroundScroll() {
		document.body.classList.add('modal-open');
	}

	// Function to enable background scrolling
	function enableBackgroundScroll() {
		document.body.classList.remove('modal-open');
	}

	// Watch for changes in the 'show' prop
	$: if (show) {
		disableBackgroundScroll();
	} else {
		enableBackgroundScroll();
	}

	// Ensure background scroll is enabled when component is destroyed
	onDestroy(() => {
		enableBackgroundScroll();
	});
</script>

<style>
    :global(body.modal-open) {
      overflow: hidden;
    }
</style>

{#if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
		on:click|self={closeModal}
		transition:fade
	>
		<div
			class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full m-4 max-h-[90vh] overflow-hidden"
			transition:fly={{ y: 50, duration: 300 }}
		>
			<div class="flex items-center justify-between p-4 text-white bg-purple-800">
				<h2 class="text-2xl font-bold">{prop.name || 'Unnamed Prop'}</h2>
				<button
					on:click={closeModal}
					class="p-1 transition-colors duration-200 rounded-full bg-gold-500 hover:bg-gold-600"
				>
					<svg
						class="w-6 h-6 text-purple-800"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
			</div>

			<div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 4rem);">
				{#if images.length > 0}
					<div class="relative mb-6">
						<img
							src={images[currentImageIndex]}
							alt={prop.name || 'Prop image'}
							class="object-cover w-full rounded-lg"
						/>
						{#if images.length > 1}
							<button
								on:click={prevImage}
								class="absolute p-2 text-white transform -translate-y-1/2 bg-purple-800 rounded-full left-2 top-1/2"
								disabled={currentImageIndex === 0}
							>
								&lt;
							</button>
							<button
								on:click={nextImage}
								class="absolute p-2 text-white transform -translate-y-1/2 bg-purple-800 rounded-full right-2 top-1/2"
								disabled={currentImageIndex === images.length - 1}
							>
								&gt;
							</button>
						{/if}
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<p><span class="font-semibold text-purple-800">ID:</span> {prop.id}</p>
					<p>
						<span class="font-semibold text-purple-800">Category:</span>
						{prop.category || 'N/A'}
					</p>
					<p><span class="font-semibold text-purple-800">Type:</span> {prop.type || 'N/A'}</p>
					<p>
						<span class="font-semibold text-purple-800">Location:</span>
						{prop.location || 'N/A'}
					</p>
					{#if prop.imagePreviewUrl}
						<p>
							<span class="font-semibold text-purple-800">Preview URL:</span>
							{prop.imagePreviewUrl}
						</p>
					{/if}
					{#if prop.lastUsed}
						<p>
							<span class="font-semibold text-purple-800">Last Used:</span>
							{prop.lastUsed.toDate().toLocaleString()}
						</p>
					{/if}
					{#if prop.created}
						<p>
							<span class="font-semibold text-purple-800">Created:</span>
							{prop.created.toDate().toLocaleString()}
						</p>
					{/if}
					{#if prop.color}
						<p><span class="font-semibold text-purple-800">Color:</span> {prop.color}</p>
					{/if}
					{#if prop.size}
						<p><span class="font-semibold text-purple-800">Size:</span> {prop.size}</p>
					{/if}
					{#if prop.material}
						<p><span class="font-semibold text-purple-800">Material:</span> {prop.material}</p>
					{/if}
					{#if prop.hairColor}
						<p><span class="font-semibold text-purple-800">Hair Color:</span> {prop.hairColor}</p>
					{/if}
					{#if prop.hairLength}
						<p><span class="font-semibold text-purple-800">Hair Length:</span> {prop.hairLength}</p>
					{/if}
					{#if prop.hairStyle}
						<p><span class="font-semibold text-purple-800">Hair Style:</span> {prop.hairStyle}</p>
					{/if}
				</div>

				{#if prop.attributes && prop.attributes.length > 0}
					<div class="mt-4">
						<h3 class="mb-2 text-lg font-semibold text-purple-800">Additional Attributes:</h3>
						<ul class="list-disc list-inside">
							{#each prop.attributes as attribute}
								<li>
									<span class="font-semibold text-purple-700">{attribute.name}:</span>
									{attribute.value}
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if prop.notes}
					<div class="mt-4">
						<h3 class="mb-2 text-lg font-semibold text-purple-800">Notes:</h3>
						<p>{prop.notes}</p>
					</div>
				{/if}

				{#if prop.tags && prop.tags.length > 0}
					<div class="mt-4">
						<h3 class="mb-2 text-lg font-semibold text-purple-800">Tags:</h3>
						<div class="flex flex-wrap gap-2">
							{#each prop.tags as tag}
								<span
									class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded"
								>
									{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body.modal-open) {
		overflow: hidden;
	}
</style>
