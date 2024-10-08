<script lang="ts">
	import type { Prop } from '$lib/propsStore';
	import PropCard from './PropCard.svelte';
	import PropDetailModal from './PropDetailModal.svelte';
	import { session } from '$lib/session';
	import { createEventDispatcher } from 'svelte';
	import InfiniteScroll from './InfiniteScroll.svelte';

	export let props: Prop[];
	export const canUpdate: boolean = false;
	export const canDelete: boolean = false;
	export const canCreate: boolean = false;
	let selectedProp: Prop | null = null;
	const dispatch = createEventDispatcher();
	let showModal = false;

	function handleViewProp(event: CustomEvent<Prop>) {
		selectedProp = event.detail;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function loadMore() {
		// Dispatch an event to the parent component to load more props
		console.log('load more');
		dispatch('loadMore');
	}

	$: userPermissions = $session.user;
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="scroll">
	{#each props as prop (prop.id)}
		<PropCard
			{prop}
			on:edit
			on:view={handleViewProp}
			canUpdate={userPermissions?.canUpdate}
			canDelete={userPermissions?.canDelete}
		/>
	{/each}
	<InfiniteScroll
		hasMore={true}
		threshold={1}
		elementScroll={window}
		on:loadMore={() => {
			console.log('load more');
			loadMore();
		}}
	/>
</div>

{#if selectedProp}
	<PropDetailModal prop={selectedProp} show={showModal} on:close={closeModal} />
{/if}
