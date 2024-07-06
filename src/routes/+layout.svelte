<script lang="ts">import AuthCheck from "$lib/AuthCheck.svelte";
</script>

<AuthCheck let:user>
  <h1>Some protected info</h1>
  <h1>Hi { user?.displayName }</h1>
  <div slot="login">
    <a href="login">Please signup</a>
  </div>
</AuthCheck>