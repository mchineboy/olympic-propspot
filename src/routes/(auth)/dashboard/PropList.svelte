<script lang="ts">
    import type { Prop } from '$lib/propsStore';
    import PropCard from './PropCard.svelte';
    import InfiniteScroll from 'svelte-infinite-scroll';
    import { createEventDispatcher } from 'svelte';
    
    export let props: Prop[];
    
    const dispatch = createEventDispatcher<{edit: Prop}>();
    
    let displayedProps: Prop[] = [];
    let page = 0;
    const pageSize = 20;
  
    function loadMoreProps() {
      const newProps = props.slice(page * pageSize, (page + 1) * pageSize);
      displayedProps = [...displayedProps, ...newProps];
      page++;
    }
  
    $: {
      page = 0;
      displayedProps = [];
      loadMoreProps();
    }
  </script>
  
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each displayedProps as prop (prop.id)}
      <PropCard {prop} on:edit={(event) => dispatch('edit', event.detail)} />
    {/each}
    <InfiniteScroll threshold={100} on:loadMore={loadMoreProps} />
  </div>