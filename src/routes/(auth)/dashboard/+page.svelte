<script lang="ts">
	import { props } from '$lib/propsStore';
	import type { Prop } from '$lib/propsStore';
	import PropList from './PropList.svelte';
	import PropForm from './PropForm.svelte';
	import { onMount } from 'svelte';

	let allProps: Prop[] = [];
	let sortOption = 'lastUsed-desc';
	let isAddDialogOpen = false;
	let editingProp: Prop | null = null;

	// New filter state variables
	let selectedType = 'All';
	let freeformFilter = '';

	// Define available types for the enumerated filter
	const availableTypes = [
		'All',
		'Clothing',
		'Furniture',
		'Accessories',
		'Electronics',
		'Wigs',
		'Other'
	];

	$: {
		allProps = $props;
		console.log('Updated allProps:', allProps);
		sortProps();
	}

	// New computed property for filtered props
	$: filteredProps = allProps.filter((prop) => {
		const typeMatch = selectedType === 'All' || prop.category === selectedType;
		const freeformMatch =
			freeformFilter === '' ||
			Object.values(prop).some(
				(value) =>
					typeof value === 'string' && value.toLowerCase().includes(freeformFilter.toLowerCase())
			);
		return typeMatch && freeformMatch;
	});

	onMount(() => {
		console.log('Component mounted');
	});

	function sortProps() {
		// ... (existing sort function)
	}

	function openAddDialog() {
		editingProp = null;
		isAddDialogOpen = true;
	}

	function openEditDialog(event: CustomEvent<Prop>) {
		editingProp = event.detail;
		isAddDialogOpen = true;
	}

	function closeDialog() {
		isAddDialogOpen = false;
		editingProp = null;
	}
</script>

<main class="container px-4 py-8 mx-auto">
	<h1 class="mb-8 text-4xl font-bold text-purple-800">Props Dashboard</h1>

	<div class="flex items-center justify-between mb-6">
		<select
			bind:value={sortOption}
			on:change={sortProps}
			class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5"
		>
			<option value="lastUsed-desc">Last Used (Newest First)</option>
			<option value="lastUsed-asc">Last Used (Oldest First)</option>
			<option value="name-asc">Name (A-Z)</option>
			<option value="name-desc">Name (Z-A)</option>
		</select>

		<select
			bind:value={selectedType}
			class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5"
		>
			{#each availableTypes as type}
				<option value={type}>{type}</option>
			{/each}
		</select>

		<input
			type="text"
			bind:value={freeformFilter}
			placeholder="Search props..."
			class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5"
		/>

		<button
			on:click={openAddDialog}
			class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700"
		>
			Add New Prop
		</button>
	</div>

	<PropList props={filteredProps} on:edit={openEditDialog} />

	{#if isAddDialogOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50"
		>
			<div
				class="relative w-full max-w-md p-4 mx-4 my-8 bg-white rounded-lg shadow-xl sm:p-6 md:p-8"
			>
				<button
					on:click={closeDialog}
					class="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
					aria-label="Close dialog"
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
				<div class="max-h-[80vh] overflow-y-auto pb-4">
					<PropForm prop={editingProp} on:save={closeDialog} on:cancel={closeDialog} />
				</div>
			</div>
		</div>
	{/if}
</main>
