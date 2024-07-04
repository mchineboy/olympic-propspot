<script lang="ts">
    import Modal from 'svelte-pieces/ui/Modal.svelte';
    import { FirebaseUiAuth, saveUserData } from 'sveltefirets';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher<{
      close: boolean;
    }>();
  </script>
  
  <Modal on:close>
    <span slot="heading">Sign In</span>
    <FirebaseUiAuth
      signInWith={{ google: true, emailPassword: true }}
      on:success={() => dispatch('close', true)}
      on:authresult={(e) => saveUserData(e.detail)} />
  </Modal>
  