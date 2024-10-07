<script lang="ts">
	import type { Prop } from '$lib/propsStore';
	import PropCard from './PropCard.svelte';
	import PropDetailModal from './PropDetailModal.svelte';
	import InfiniteScroll from 'svelte-infinite-scroll';
	import { session } from '$lib/session';

	export let props: Prop[];
	export const canUpdate: boolean = false;
	export const canDelete: boolean = false;
	export const canCreate: boolean = false;

	let displayedProps: Prop[] = [];
	let page = 0;
	const pageSize = 20;

	let selectedProp: Prop | null = null;
	let showModal = false;

	$: displayedProps = [
		...displayedProps,
		...props.splice(pageSize * page, pageSize * (page + 1) + 1)
	];

	function handleViewProp(event: CustomEvent<Prop>) {
		selectedProp = event.detail;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	$: userPermissions = $session.user;
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each displayedProps as prop (prop.id)}
		<PropCard
			{prop}
			on:edit
			on:view={handleViewProp}
			canUpdate={userPermissions?.canUpdate}
			canDelete={userPermissions?.canDelete}
		/>
	{/each}
	<InfiniteScroll
		threshold={100}
		on:loadMore={() => {
			page++;
			console.log('loading more props...');
		}}
	/>
</div>

{#if selectedProp}
	<PropDetailModal prop={selectedProp} show={showModal} on:close={closeModal} />
{/if}
