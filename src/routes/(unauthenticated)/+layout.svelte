<script lang="ts">
  import LoadingPage from '$lib/components/LoadingPage.svelte';
  import { isAuthenticated } from '$lib/store/auth';
  import { onMount } from 'svelte';

  onMount(() => {
    if ($isAuthenticated) {
      window.location.assign('/');
    }
  });
</script>

{#if !$isAuthenticated}
  <slot />
{:else}
  <LoadingPage />
{/if}
