<script lang="ts">
	import '../app.css';
	import Nav from '../components/Nav.svelte';
	import type { LayoutData } from './$types';
    import { page } from '$app/stores';

	export let data: LayoutData;
</script>

{#if !$page.url.pathname.startsWith('/dashboard')}
	<Nav loading={false} loggedIn={false} logout={() => {}} />
{/if}

<slot />
