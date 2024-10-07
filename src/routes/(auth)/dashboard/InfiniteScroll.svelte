<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	export let threshold = 0;
	export let horizontal = false;
	export let elementScroll: Window | HTMLElement | undefined = undefined;
	export let hasMore = true;

	const dispatch = createEventDispatcher();
	let isLoadMore = false;
	let component: HTMLElement;

	$: {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode;
            if (element) {
                element.addEventListener('scroll', onScroll);
                element.addEventListener('resize', onScroll);
            } else {
                console.error('Element not found');
            }
		}
	}

	const onScroll = (e: Event) => {
        
		const scrollTarget = (e.target as Document).scrollingElement || e.target;

        if (!scrollTarget) {
            return;
        }

		const offset = horizontal
			? (scrollTarget as HTMLElement).scrollWidth - (scrollTarget as HTMLElement).clientWidth - (scrollTarget as HTMLElement).scrollLeft
			: (scrollTarget as HTMLElement).scrollHeight - (scrollTarget as HTMLElement).clientHeight - (scrollTarget as HTMLElement).scrollTop;
        
		if (offset <= threshold) {
			if (!isLoadMore && hasMore) {
				dispatch('loadMore');
			}
			isLoadMore = true;
		} else {
			isLoadMore = false;
		}
	};

	onDestroy(() => {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode;
            if (element) {
                // element.removeEventListener('scroll', undefined);
                // element.removeEventListener('resize', null);
                console.log('destroyed');
            }
		}
	});
</script>

<div bind:this={component} style="width:0px" />
