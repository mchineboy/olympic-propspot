<script lang="ts">
	import type { Prop } from '$lib/propsStore';
	import { createEventDispatcher, onMount } from 'svelte';
	import { props } from '$lib/propsStore';
	import { fade } from 'svelte/transition';

	export let prop: Prop;
	export let canUpdate: boolean = false;
	export let canDelete: boolean = false;

	const dispatch = createEventDispatcher<{ edit: Prop; view: Prop }>();

	let currentImageIndex = 0;
	let intervalId: any;
	let touchStartX: number;
	let mouseStartX: number | null;

	$: images =
		prop.imageUrls && prop.imageUrls.length > 0
			? prop.imageUrls
			: prop.imageUrl
				? [prop.imageUrl]
				: [];

	function editProp() {
		dispatch('edit', prop);
	}

	async function deleteProp() {
		if (confirm('Are you sure you want to delete this prop?')) {
			try {
				await props.deleteProp(prop.id);
			} catch (error) {
				console.error('Error deleting prop:', error);
				alert('Failed to delete prop. Please try again.');
			}
		}
	}

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % images.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
	}

	function startCarousel() {
		if (images.length > 1) {
			intervalId = setInterval(nextImage, 10000);
		}
	}

	function viewProp() {
		dispatch('view', prop);
	}

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent) {
		const touchEndX = event.changedTouches[0].clientX;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				nextImage();
			} else {
				prevImage();
			}
		}
	}

	function handleMouseDown(event: MouseEvent) {
		mouseStartX = event.clientX;
	}

	function handleMouseUp(event: MouseEvent) {
		if (mouseStartX !== null) {
			const diff = mouseStartX - event.clientX;

			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					nextImage();
				} else {
					prevImage();
				}
			}

			mouseStartX = null;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			prevImage();
		} else if (event.key === 'ArrowRight') {
			nextImage();
		}
	}

	onMount(() => {
		startCarousel();
		return () => {
			clearInterval(intervalId);
		};
	});
</script>

<div
	class="flex flex-col h-full p-6 bg-white border border-purple-200 rounded-lg shadow-md cursor-pointer"
	on:click={viewProp}
	role="link"
	tabindex="0"
	on:keydown={viewProp}
	aria-label="View prop details"
>
	<div class="flex-grow">
		{#if images.length > 0}
			<div
				role="treegrid"
				class="relative mb-4 overflow-hidden"
				aria-roledescription="carousel"
				aria-label="Prop images"
				on:touchstart={handleTouchStart}
				on:touchend={handleTouchEnd}
				on:mousedown={handleMouseDown}
				on:mouseup={handleMouseUp}
				on:keydown={handleKeyDown}
				tabindex="-1"
			>
				{#each images as image, index}
					{#if index === currentImageIndex}
						<img
							src={image}
							alt={`${prop.name || 'Prop'} image ${index + 1} of ${images.length}`}
							class="object-cover w-full rounded-md"
							in:fade={{ duration: 300 }}
							out:fade={{ duration: 300 }}
						/>
					{/if}
				{/each}
				{#if images.length > 1}
					<button
						on:click|stopPropagation={prevImage}
						class="absolute left-0 p-2 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-r top-1/2"
						aria-label="Previous image"
					>
						&lt;
					</button>
					<button
						on:click|stopPropagation={nextImage}
						class="absolute right-0 p-2 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-l top-1/2"
						aria-label="Next image"
					>
						&gt;
					</button>
				{/if}
			</div>
		{/if}
		<h3 class="mb-2 text-xl font-semibold text-purple-800">{prop.name || 'Unnamed Prop'}</h3>
		<p class="mb-1 text-purple-600">Type: {prop.type || 'N/A'}</p>
		<p class="mb-1 text-purple-600">Category: {prop.category || 'N/A'}</p>
		<p class="mb-1 text-purple-600">Location: {prop.location || 'N/A'}</p>
		{#if prop.color}
			<p class="mb-1 text-purple-600">Color: {prop.color}</p>
		{/if}
		{#if prop.size}
			<p class="mb-1 text-purple-600">Size: {prop.size}</p>
		{/if}
		{#if prop.material}
			<p class="mb-1 text-purple-600">Material: {prop.material}</p>
		{/if}
		{#if prop.category === 'Wigs'}
			<p class="mb-1 text-purple-600">Hair Color: {prop.hairColor || 'N/A'}</p>
			<p class="mb-1 text-purple-600">Hair Length: {prop.hairLength || 'N/A'}</p>
			<p class="mb-1 text-purple-600">Hair Style: {prop.hairStyle || 'N/A'}</p>
		{/if}
		{#if prop.attributes && prop.attributes.length > 0}
			<div class="mt-2">
				<h4 class="font-semibold text-purple-700">Additional Attributes:</h4>
				<ul class="list-disc list-inside">
					{#each prop.attributes as attribute}
						<li class="text-purple-600">{attribute.name}: {attribute.value}</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if prop.notes}
			<p class="mt-2 text-purple-600"><span class="font-semibold">Notes:</span> {prop.notes}</p>
		{/if}
		{#if prop.tags && prop.tags.length > 0}
			<div class="flex flex-wrap gap-1 mt-2">
				{#each prop.tags as tag}
					<span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded"
						>{tag}</span
					>
				{/each}
			</div>
		{/if}
	</div>
	<div class="flex justify-between pt-4 mt-4 border-t border-purple-200">
		{#if canUpdate}
			<button
				on:click|stopPropagation={editProp}
				class="px-3 py-1 font-bold text-white rounded bg-gold-500 hover:bg-gold-600"
			>
				Edit
			</button>
		{:else}
			<div></div>
		{/if}
		{#if canDelete}
			<button
				on:click|stopPropagation={deleteProp}
				class="px-3 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600"
			>
				Delete
			</button>
		{/if}
	</div>
</div>
