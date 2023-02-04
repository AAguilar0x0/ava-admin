<script lang="ts">
  import { getContext } from 'svelte';
  import Editor from '@tinymce/tinymce-svelte';
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
  $: details = data?.details ?? [];

  const { pushSnackbar }: { pushSnackbar: (message: string, status: TSnackbarStatus) => void } =
    getContext('snackbar');

  let open = false;

  let inptName = '';
  let inptDesc = '';
  let textDesc = '';
  let modalState: ModalState;

  let detailID = '';

  let columns = [
    { name: 'ID' },
    { name: 'Name' },
    {
      name: 'Description',
      formatter: (cell: string) => {
        return h(
          'p',
          {
            className: 'truncate text-ellipsis'
          },
          cell
        );
      },
      width: '20%'
    },
    { name: 'Image', hidden: true },
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
                detailID = row.cells[0].data;
                inptName = row.cells[1].data;
                inptDesc = row.cells[2].data;
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
      let result = await fetch(`/api/details/${id}`, { method: 'DELETE' });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Detail deleted successfully!', 'success');
      refreshData();
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleAdd() {
    try {
      let result = await fetch('/api/details', {
        method: 'POST',
        body: JSON.stringify({
          name: inptName,
          description: inptDesc,
          image: ''
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Detail added successfully!', 'success');
      refreshData();
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleEdit() {
    try {
      let result = await fetch(`/api/details/${detailID}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: inptName,
          description: inptDesc
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Detail edited successfully!', 'success');
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
        let descLen = textDesc.trim().length;
        if (nameLen === 0 && descLen === 0) {
          message = 'Name and description is required.';
        } else if (nameLen === 0) {
          message = 'Name is required.';
        } else if (descLen === 0) {
          message = 'Description is required.';
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

<div class="flex-inline flex flex-wrap gap-1">
  <span class="text-2xl font-semibold">Details</span>
  <button
    on:click={() => {
      inptName = '';
      inptDesc = '<p></p>';
      modalState = MODAL_STATES[1];
      open = true;
    }}
  >
    <Icon icon="mdi:plus-thick" class="text-3xl text-green-500 hover:text-green-700" />
  </button>
</div>
<Grid
  data={details}
  {columns}
  fixedHeader
  search
  resizable
  pagination
  sort
  className={{
    td: 'max-w-sm'
  }}
/>
<Dialog bind:open fullscreen>
  <Header>
    <Title id="fullscreen-title">Add/Edit Details</Title>
    <IconButton action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <div class="p-3">
      <h2>Name</h2>
      <Textfield bind:value={inptName} class="w-full" />
    </div>
    <div class="p-3">
      <h2>Description</h2>
      <Editor
        bind:value={inptDesc}
        bind:text={textDesc}
        scriptSrc="tinymce/tinymce.min.js"
        cssClass="w-full"
        conf={{
          plugins: 'advlist lists wordcount pagebreak quickbars emoticons',
          toolbar:
            'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist',
          quickbars_image_toolbar: false,
          quickbars_insert_toolbar: 'quicktable hr pagebreak'
        }}
      />
    </div>
  </Content>
  <Actions>
    <Button action="" on:click={handleSubmit}>
      <Label>Submit</Label>
    </Button>
  </Actions>
</Dialog>
