<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { Prop, PropAttribute } from '$lib/propsStore';
	import { props } from '$lib/propsStore';
	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import AttributeList from './AttributeList.svelte';
	import MobileImageUpload from '$components/MobileImageUpload.svelte';

	export let prop: Prop | null = null;
	export let canCreate: boolean = false;
	export let canUpdate: boolean = false;

	const dispatch = createEventDispatcher();
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

	const editingProp: Writable<Prop> = writable(getEmptyProp());

	onMount(() => {
		if (prop) {
			editingProp.set(convertOldPropFormat({ ...prop }));
		}
	});

	$: availableTypes =
		$editingProp.category && $editingProp.category in types
			? types[$editingProp.category as Category]
			: [];
	$: isWig = $editingProp.category === 'Wigs';

	function getEmptyProp(): Prop {
		return {
			id: '',
			name: '',
			category: undefined,
			type: '',
			imageUrls: [],
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

	function convertOldPropFormat(oldProp: any): Prop {
		const newProp = { ...oldProp };
		if (newProp.imageUrl && !newProp.imageUrls) {
			newProp.imageUrls = [newProp.imageUrl];
			delete newProp.imageUrl;
		}
		return newProp as Prop;
	}


	function handleImagesChange(event: CustomEvent<string[]>) {
		editingProp.update((prop) => ({ ...prop, imageUrls: event.detail }));
	}

	async function saveProp() {
		error = null;
		isLoading = true;
		try {
			if (!canCreate && !canUpdate) {
				throw new Error('You do not have permission to perform this action.');
			}

			let imageUrls: string[] = [];

			if ($editingProp.imageUrls && $editingProp.imageUrls.length > 0) {
				imageUrls = await Promise.all($editingProp.imageUrls.map(uploadImage));
			}

			const propToSave = {
				...$editingProp,
				imageUrls: imageUrls
			};

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

	async function uploadImage(imageData: string): Promise<string> {
		const storage = getStorage();
		const fileName = `prop-images/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
		const storageRef = ref(storage, fileName);

		// If the imageData is already a URL, return it as is
		if (imageData.startsWith('http')) {
			return imageData;
		}

		// Otherwise, upload the new image
		const response = await fetch(imageData);
		const blob = await response.blob();

		try {
			const snapshot = await uploadBytes(storageRef, blob);
			const downloadURL = await getDownloadURL(snapshot.ref);
			return downloadURL;
		} catch (err) {
			console.error('Error uploading image: ', err);
			throw err;
		}
	}

	// This function was not truncated, but it's important for handling category changes
	function handleCategoryChange() {
		editingProp.update((prop) => {
			if (prop.category && prop.category in types) {
				const categoryTypes = types[prop.category as Category];
				if (prop.type && !categoryTypes.includes(prop.type)) {
					prop.type = categoryTypes[0];
				}
			} else {
				prop.type = '';
			}
			return prop;
		});
	}

	// This function handles changes to the tags input
	function handleTagsInput(event: Event) {
		const target = event.target as HTMLInputElement;
		editingProp.update((prop) => ({
			...prop,
			tags: target.value.split(',').map((tag: string) => tag.trim())
		}));
	}

	// This function handles changes to the attributes
	function handleAttributesChange(event: CustomEvent<PropAttribute[]>) {
		editingProp.update((prop) => ({ ...prop, attributes: event.detail }));
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
			bind:value={$editingProp.name}
			required
			class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
		/>
	</div>

	<div>
		<label for="prop-category" class="block text-sm font-medium text-purple-700">Category</label>
		<select
			id="prop-category"
			bind:value={$editingProp.category}
			on:change={handleCategoryChange}
			class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
		>
			<option value="">Select a category</option>
			{#each categories as category}
				<option value={category}>{category}</option>
			{/each}
		</select>
	</div>

	{#if $editingProp.category}
		<div>
			<label for="prop-type" class="block text-sm font-medium text-purple-700">Type</label>
			<select
				id="prop-type"
				bind:value={$editingProp.type}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			>
				<option value="">Select a type</option>
				{#each availableTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>
	{/if}

	{#if $editingProp.type === 'Other' || $editingProp.type === 'Custom'}
		<div>
			<label for="prop-custom-type" class="block text-sm font-medium text-purple-700"
				>Custom Type</label
			>
			<input
				type="text"
				id="prop-custom-type"
				bind:value={$editingProp.type}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			/>
		</div>
	{/if}

	<div>
		<label for="prop-location" class="block text-sm font-medium text-purple-700">Location</label>
		<input
			type="text"
			id="prop-location"
			bind:value={$editingProp.location}
			class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
		/>
	</div>

	{#if !isWig}
		<div>
			<label for="prop-color" class="block text-sm font-medium text-purple-700">Color</label>
			<input
				type="text"
				id="prop-color"
				bind:value={$editingProp.color}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			/>
		</div>

		<div>
			<label for="prop-size" class="block text-sm font-medium text-purple-700">Size</label>
			<input
				type="text"
				id="prop-size"
				bind:value={$editingProp.size}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			/>
		</div>

		<div>
			<label for="prop-material" class="block text-sm font-medium text-purple-700">Material</label>
			<input
				type="text"
				id="prop-material"
				bind:value={$editingProp.material}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			/>
		</div>
	{/if}

	{#if isWig}
		<div>
			<label for="prop-hair-color" class="block text-sm font-medium text-purple-700"
				>Hair Color</label
			>
			<input
				type="text"
				id="prop-hair-color"
				bind:value={$editingProp.hairColor}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			/>
		</div>

		<div>
			<label for="prop-hair-length" class="block text-sm font-medium text-purple-700"
				>Hair Length</label
			>
			<input
				type="text"
				id="prop-hair-length"
				bind:value={$editingProp.hairLength}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			/>
		</div>

		<div>
			<label for="prop-hair-style" class="block text-sm font-medium text-purple-700"
				>Hair Style</label
			>
			<input
				type="text"
				id="prop-hair-style"
				bind:value={$editingProp.hairStyle}
				class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
			/>
		</div>
	{/if}

	<AttributeList attributes={$editingProp.attributes} on:change={handleAttributesChange} />

	<div>
		<label for="prop-notes" class="block text-sm font-medium text-purple-700">Notes</label>
		<textarea
			id="prop-notes"
			bind:value={$editingProp.notes}
			class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
		></textarea>
	</div>

	<div>
		<label for="prop-tags" class="block text-sm font-medium text-purple-700"
			>Tags (comma-separated)</label
		>
		<input
			type="text"
			id="prop-tags"
			value={$editingProp.tags?.join(', ')}
			on:input={handleTagsInput}
			class="block w-full mt-1 border-purple-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
		/>
	</div>

	<div>
		<label id="prop-images-label" class="block mb-2 text-sm font-medium text-purple-700"
			>Images</label
		>
		<MobileImageUpload
			images={$editingProp.imageUrls}
			on:change={handleImagesChange}
			ariaLabel="prop-images-label"
		/>
	</div>

	<div class="flex justify-between pt-4">
		<button
			type="submit"
			class="px-4 py-2 font-bold text-white transition duration-300 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={isLoading || (!canCreate && !canUpdate)}
		>
			{isLoading ? 'Saving...' : 'Save'}
		</button>
		<button
			type="button"
			on:click={() => dispatch('cancel')}
			class="px-4 py-2 font-bold text-gray-800 transition duration-300 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={isLoading}
		>
			Cancel
		</button>
	</div>
</form>
