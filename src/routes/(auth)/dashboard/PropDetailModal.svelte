<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Prop } from '$lib/propsStore';
	import { createEventDispatcher } from 'svelte';

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
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
		on:click|self={closeModal}
		transition:fade
	>
		<div
			class="relative w-full max-w-3xl p-8 m-4 bg-white rounded-lg shadow-xl"
			transition:fly={{ y: 50, duration: 300 }}
		>
			<button
				on:click={closeModal}
				class="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
			>
				<svg
					class="w-6 h-6"
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
							class="absolute p-2 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-2 top-1/2"
							disabled={currentImageIndex === 0}
						>
							&lt;
						</button>
						<button
							on:click={nextImage}
							class="absolute p-2 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-2 top-1/2"
							disabled={currentImageIndex === images.length - 1}
						>
							&gt;
						</button>
					{/if}
				</div>
			{/if}

			<h2 class="mb-4 text-2xl font-bold text-purple-800">{prop.name || 'Unnamed Prop'}</h2>
			<div class="grid grid-cols-2 gap-4">
				<p><span class="font-semibold">Type:</span> {prop.type || 'N/A'}</p>
				<p><span class="font-semibold">Category:</span> {prop.category || 'N/A'}</p>
				<p><span class="font-semibold">Location:</span> {prop.location || 'N/A'}</p>
				{#if prop.color}
					<p><span class="font-semibold">Color:</span> {prop.color}</p>
				{/if}
				{#if prop.size}
					<p><span class="font-semibold">Size:</span> {prop.size}</p>
				{/if}
				{#if prop.material}
					<p><span class="font-semibold">Material:</span> {prop.material}</p>
				{/if}
				{#if prop.category === 'Wigs'}
					<p><span class="font-semibold">Hair Color:</span> {prop.hairColor || 'N/A'}</p>
					<p><span class="font-semibold">Hair Length:</span> {prop.hairLength || 'N/A'}</p>
					<p><span class="font-semibold">Hair Style:</span> {prop.hairStyle || 'N/A'}</p>
				{/if}
			</div>

			{#if prop.attributes && prop.attributes.length > 0}
				<div class="mt-4">
					<h3 class="mb-2 text-lg font-semibold">Additional Attributes:</h3>
					<ul class="list-disc list-inside">
						{#each prop.attributes as attribute}
							<li>{attribute.name}: {attribute.value}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if prop.notes}
				<div class="mt-4">
					<h3 class="mb-2 text-lg font-semibold">Notes:</h3>
					<p>{prop.notes}</p>
				</div>
			{/if}

			{#if prop.tags && prop.tags.length > 0}
				<div class="mt-4">
					<h3 class="mb-2 text-lg font-semibold">Tags:</h3>
					<div class="flex flex-wrap gap-2">
						{#each prop.tags as tag}
							<span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
								{tag}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
