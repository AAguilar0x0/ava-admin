<script lang="ts">
  import '../app.css';
  import { setContext } from 'svelte';
  import Snackbar, { Label, Actions } from '@smui/snackbar';
  import IconButton from '@smui/icon-button';
  import SnackbarStatus, { type TSnackbarStatus } from '$lib/types/SnackbarStatus';

  let snackbar: Snackbar;
  let labelText = '';
  $: className = snackbar?.getElement().children[0].classList.value ?? '';

  setContext('snackbar', {
    pushSnackbar: (message: string, status: TSnackbarStatus) => {
      labelText = message;
      let addedClass = '';
      switch (status) {
        case SnackbarStatus[1]:
          addedClass = '!bg-green-500';
          break;
        case SnackbarStatus[2]:
          addedClass = '!bg-yellow-500';
          break;
        case SnackbarStatus[3]:
          addedClass = '!bg-red-500';
          break;
        case SnackbarStatus[0]:
        default:
          addedClass = '';
          break;
      }
      snackbar.getElement().children[0].classList.value = `${className} ${addedClass}`;
      // @ts-ignore
      snackbar.open();
    }
  });
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

<slot />

<Snackbar leading bind:this={snackbar} {labelText}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
