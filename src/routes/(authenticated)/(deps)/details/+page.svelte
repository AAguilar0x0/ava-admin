<script lang="ts">
  import Editor from '@tinymce/tinymce-svelte';
  import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import Button, { Label } from '@smui/button';
  import RecordToType from '$lib/model';
  import type Detail from '$lib/model/detail';
  import { defaultDetail } from '$lib/model/detail';
  import Icon from '@iconify/svelte';
  import { h } from 'gridjs';
  import Grid from 'gridjs-svelte';
  import type { PageData } from './$types';

  const MODAL_STATES = ['Init', 'Add', 'Edit'] as const;

  export let data: PageData;
  $: details = data?.details ?? [];

  let open = false;

  let inptName = '';
  let inptDesc = '';
  let modalState: (typeof MODAL_STATES)[number] = 'Init';

  let detailID = '';

  let columns = [
    { name: 'ID', sort: true },
    { name: 'Name', sort: true },
    {
      name: 'Description',
      sort: true,
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
    { name: 'Image', sort: true, hidden: true },
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
                console.log('HERE', row);
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
    try {
      let result = await fetch('/api/details');
      if (!result.ok) throw new Error(result.statusText);
      let data: Detail[] = await result.json();
      details = data.map((detail) => RecordToType<Detail>(detail, defaultDetail));
    } catch (error) {}
  }

  async function handDelete(id: string) {
    try {
      let result = await fetch(`/api/details/${id}`, { method: 'DELETE' });
      if (!result.ok) throw new Error(result.statusText);
      refreshData();
    } catch (error) {}
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
      refreshData();
    } catch (error) {}
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
      refreshData();
    } catch (error) {}
  }

  async function handleSubmit() {
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
  }
</script>

<div class="flex flex-inline flex-wrap gap-1">
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
<Grid data={details} fixedHeader search resizable pagination {columns} />
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
    <Button on:click={handleSubmit}>
      <Label>Submit</Label>
    </Button>
  </Actions>
</Dialog>
