<script lang="ts">
    import AuthCheck from '$lib/AuthCheck.svelte';
    import Login from '$lib/Login.svelte';
    // Other imports...
  </script>
  
  <AuthCheck>
    <h1>Welcome, logged-in user!</h1>
  
    <Login slot="login" />
  </AuthCheck>