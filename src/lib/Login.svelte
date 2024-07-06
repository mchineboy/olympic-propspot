<script lang="ts">
	// Add login logic here
	function handleLogin() {
		// Implement your login functionality
		console.log('Login attempted');
	}
</script>

<div>
	<h2>Login</h2>
	<form on:submit|preventDefault={handleLogin}>
		<input type="email" placeholder="Email" required />
		<input type="password" placeholder="Password" required />
		<button type="submit">Log In</button>
	</form>
</div>
