<script lang="ts">
  import type { Prop } from '$lib/propsStore';
  import PropCard from './PropCard.svelte';
  import InfiniteScroll from 'svelte-infinite-scroll';
  
  export let props: Prop[];
  
  let displayedProps: Prop[] = [];
  let page = 0;
  const pageSize = 20;

  $: {
    console.log('PropList received props:', props);
    page = 0;
    displayedProps = [];
    loadMoreProps();
  }

  function loadMoreProps() {
    const newProps = props.slice(page * pageSize, (page + 1) * pageSize);
    displayedProps = [...displayedProps, ...newProps];
    page++;
    console.log('Displayed props after loading more:', displayedProps);
  }
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {#each displayedProps as prop (prop.id)}
    <PropCard {prop} on:edit />
  {/each}
  <InfiniteScroll threshold={100} on:loadMore={loadMoreProps} />
</div>