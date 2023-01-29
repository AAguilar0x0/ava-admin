<script lang="ts">
  import 'gridjs/dist/theme/mermaid.css';
</script>

<svelte:head>
  <!-- Material Icons -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <!-- Roboto -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />
  <!-- Roboto Mono -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
  <!-- SMUI Styles -->
  <link rel="stylesheet" href="/smui.css" />
</svelte:head>

<div class="m-2 p-2">
  <slot />
</div>
