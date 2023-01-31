<script lang="ts">
  import { getContext } from 'svelte';
  import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import Button, { Label } from '@smui/button';
  import Icon from '@iconify/svelte';
  import { h } from 'gridjs';
  import Grid from 'gridjs-svelte';
  import type { PageData } from './$types';
  import type { TSnackbarStatus } from '$lib/types/SnackbarStatus';
  import { invalidateAll } from '$app/navigation';

  const MODAL_STATES = ['Init', 'Add', 'Edit'] as const;
  type ModalState = (typeof MODAL_STATES)[number];

  export let data: PageData;
  $: techStack = data?.techStack ?? [];

  const { pushSnackbar }: { pushSnackbar: (message: string, status: TSnackbarStatus) => void } =
    getContext('snackbar');

  let open = false;

  let inptName = '';
  let inptCategory = '';
  let modalState: ModalState;

  let techStackId = '';

  let columns = [
    { name: 'ID', sort: true },
    { name: 'Name', sort: true },
    { name: 'Category', sort: true },
    {
      name: 'Actions',
      sort: false,
      formatter: (_: unknown, row: any) => {
        return [
          h(
            'button',
            {
              className:
                'py-2 mb-4 px-4 border rounded-md text-white bg-blue-500 hover:bg-blue-700',
              onClick: () => {
                techStackId = row.cells[0].data;
                inptName = row.cells[1].data;
                inptCategory = row.cells[2].data;
                modalState = MODAL_STATES[2];
                open = true;
              }
            },
            'Edit'
          ),
          h(
            'button',
            {
              className: 'py-2 mb-4 px-4 border rounded-md text-white bg-red-500 hover:bg-red-700',
              onClick: () => {
                handDelete(row.cells[0].data);
              }
            },
            'Delete'
          )
        ];
      }
    }
  ];

  async function refreshData() {
    invalidateAll();
  }

  async function handDelete(id: string) {
    try {
      let result = await fetch(`/api/tech-stacks/${id}`, { method: 'DELETE' });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Tech Stack deleted successfully!', 'success');
      refreshData();
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleAdd() {
    try {
      let result = await fetch('/api/tech-stacks', {
        method: 'POST',
        body: JSON.stringify({
          name: inptName,
          category: inptCategory
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Tech Stack added successfully!', 'success');
      refreshData();
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleEdit() {
    try {
      let result = await fetch(`/api/tech-stacks/${techStackId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: inptName,
          category: inptCategory
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Tech Stack edited successfully!', 'success');
      refreshData();
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleSubmit() {
    switch (modalState) {
      case MODAL_STATES[1]:
      case MODAL_STATES[2]:
        let message = '';
        let nameLen = inptName.trim().length;
        let categoryLen = inptCategory.trim().length;
        if (nameLen === 0 && categoryLen === 0) {
          message = 'Name and category is required.';
        } else if (nameLen === 0) {
          message = 'Name is required.';
        } else if (categoryLen === 0) {
          message = 'Category is required.';
        }
        if (message.length !== 0) {
          pushSnackbar(message, 'error');
          return;
        }
      default:
        break;
    }
    switch (modalState) {
      case MODAL_STATES[1]:
        await handleAdd();
        break;
      case MODAL_STATES[2]:
        await handleEdit();
        break;
      case MODAL_STATES[0]:
      default:
        break;
    }
    open = false;
  }
</script>

<div class="flex flex-inline flex-wrap gap-1">
  <span class="text-2xl font-semibold">Tech Stacks</span>
  <button
    on:click={() => {
      inptName = '';
      inptCategory = '';
      modalState = MODAL_STATES[1];
      open = true;
    }}
  >
    <Icon icon="mdi:plus-thick" class="text-3xl text-green-500 hover:text-green-700" />
  </button>
</div>
<Grid data={techStack} fixedHeader search resizable pagination {columns} />
<Dialog bind:open fullscreen>
  <Header>
    <Title id="fullscreen-title">Add/Edit Tech Stacks</Title>
    <IconButton action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <div class="flex flex-row flex-wrap">
      <div class="p-3 grow">
        <h2>Name</h2>
        <Textfield bind:value={inptName} class="w-full" />
      </div>
      <div class="p-3 grow">
        <h2>Category</h2>
        <Textfield bind:value={inptCategory} class="w-full" />
      </div>
    </div>
  </Content>
  <Actions>
    <Button action="" on:click={handleSubmit}>
      <Label>Submit</Label>
    </Button>
  </Actions>
</Dialog>
