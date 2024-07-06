<script lang="ts">
	import AuthCheck from '$lib/AuthCheck.svelte';
	import Login from '$lib/Login.svelte';  
    import "../app.css";
</script>

<AuthCheck>
	<h1>Welcome, logged-in user!</h1>

	<Login slot="login" />
</AuthCheck>
