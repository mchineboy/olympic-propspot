<script lang="ts">
	import '../app.css';
	import Nav from '../components/Nav.svelte';
    import { page } from '$app/stores';
    import { session } from '$lib/session';

    let loading: boolean = true;
    let loggedIn: boolean = false;
    let user: any = null;

    session.subscribe((cur: any) => {
        loading = cur?.loading;
        loggedIn = cur?.loggedIn;
        user = cur?.user;
    });
</script>

{#if !$page.url.pathname.startsWith('/dashboard') && !$page.url.pathname.startsWith('/admin')}
    {#if $page.url.pathname !== '/login' && $page.url.pathname !== '/register'}
        <Nav loading={loading} loggedIn={loggedIn} logout={() => {}} />
    {/if}
{/if}

<slot />
