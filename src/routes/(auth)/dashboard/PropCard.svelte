<script lang="ts">
	import type { Prop } from '$lib/propsStore';
	import { createEventDispatcher } from 'svelte';
	import { props } from '$lib/propsStore';

	export let prop: Prop;
	export let canUpdate: boolean = false;
	export let canDelete: boolean = false;

	const dispatch = createEventDispatcher<{ edit: Prop }>();

	function editProp() {
		dispatch('edit', prop);
	}

	console.log('PropCard received prop:', prop);

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
</script>

<div class="flex flex-col h-full p-6 bg-white border border-purple-200 rounded-lg shadow-md">
	<div class="flex-grow">
		{#if prop.imageUrl}
			<img
				src={prop.imageUrl}
				alt={prop.name || 'Prop image'}
				class="object-cover w-full h-full mb-4 rounded-md"
			/>
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
	</div>
	<div class="flex justify-between pt-4 mt-4 border-t border-purple-200">
		{#if canUpdate}
			<button
				on:click={editProp}
				class="px-3 py-1 font-bold text-white rounded bg-gold-500 hover:bg-gold-600"
			>
				Edit
			</button>
		{:else}
			<div></div>
		{/if}
		{#if canDelete}
			<button
				on:click={deleteProp}
				class="px-3 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-600"
			>
				Delete
			</button>
		{/if}
	</div>
</div>
