<script lang="ts">
  import RecordToType from '$lib/model';
  import type Detail from '$lib/model/detail';
  import { defaultDetail } from '$lib/model/detail';
  import Icon from '@iconify/svelte';
  import { h } from 'gridjs';
  import Grid from 'gridjs-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: details = data?.details ?? [];

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
                console.log('action click', row.cells[0].data);
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
</script>

<div class="flex flex-inline flex-wrap gap-1">
  <span class="text-2xl font-semibold">Details</span>
  <button>
    <Icon icon="mdi:plus-thick" class="text-3xl text-green-500 hover:text-green-700" />
  </button>
</div>
<Grid data={details} fixedHeader search resizable pagination {columns} />
