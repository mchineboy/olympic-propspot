<script lang="ts">
    import '../app.css';
    import Nav from '../components/Nav.svelte';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
</script>

<Nav loading={false} loggedIn={false} user={null} logout={() => {}} />

<slot />