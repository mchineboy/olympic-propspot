<script lang="ts">
	import AuthCheck from '$lib/AuthCheck.svelte';
</script>

<AuthCheck let:user>
	<slot {user} />
</AuthCheck>
