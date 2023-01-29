<script lang="ts">
  import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
  import IconButton from '@smui/icon-button';
  import Button, { Label } from '@smui/button';
  import RecordToType from '$lib/model';
  import type Detail from '$lib/model/detail';
  import { defaultDetail } from '$lib/model/detail';
  import Icon from '@iconify/svelte';
  import { h } from 'gridjs';
  import Grid from 'gridjs-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: details = data?.details ?? [];

  let open = false;

  let columns = [
    { name: 'ID', sort: true },
    { name: 'Name', sort: true },
    { name: 'Description', sort: true },
    { name: 'Image', sort: true },
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

  let response = 'Nothing yet.';

  function closeHandler(e: CustomEvent<{ action: string }>) {
    switch (e.detail.action) {
      case 'close':
        response = 'Closed without response.';
        break;
      case 'reject':
        response = 'Rejected.';
        break;
      case 'accept':
        response = 'Accepted.';
        break;
    }
  }

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
</script>

<div class="flex flex-inline flex-wrap gap-1">
  <span class="text-2xl font-semibold">Details</span>
  <button
    on:click={() => {
      open = true;
    }}
  >
    <Icon icon="mdi:plus-thick" class="text-3xl text-green-500 hover:text-green-700" />
  </button>
</div>
<Grid data={details} fixedHeader search resizable pagination {columns} />
<Dialog bind:open fullscreen on:SMUIDialog:closed={closeHandler}>
  <Header>
    <Title id="fullscreen-title">Add/Edit Details</Title>
    <IconButton action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <div class="p-5">
      <h2>Description</h2>
    </div>
    <!-- {#each Array(3) as _item}
      <LoremIpsum />
    {/each} -->
  </Content>
  <Actions>
    <Button>
      <Label>Submit</Label>
    </Button>
  </Actions>
</Dialog>
