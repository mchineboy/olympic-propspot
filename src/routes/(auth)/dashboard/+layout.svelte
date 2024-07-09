<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/session';
    import Nav from '$components/Nav.svelte';
  
    let loading = true;
    let loggedIn = false;
  
    onMount(async () => {
      // Initialize your session here
      // For example:
      // const userData = await fetchUserData();
      // session.set({ loggedIn: !!userData, user: userData });
      loading = false;
      loggedIn = $session.loggedIn;
    });
  
    function logout() {
      // Implement your logout logic here
    }
  </script>
  
  <Nav {loading} {loggedIn} {logout} />