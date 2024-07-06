<script lang="ts">import { user } from "./auth";
</script>

{#if $user}
  <slot user={$user} />
{:else}
  <slot name="login" />
{/if}