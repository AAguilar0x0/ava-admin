<script lang="ts">
  import LoadingPage from '$lib/components/LoadingPage.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { isAuthenticated } from '$lib/store/auth';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$isAuthenticated) {
      window.location.assign('/sign-in');
    }
  });
</script>

{#if $isAuthenticated}
  <Sidebar>
    <slot />
  </Sidebar>
{:else}
  <LoadingPage />
{/if}
