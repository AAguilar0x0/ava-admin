<script lang="ts">
  import { getContext } from 'svelte';
  import Editor from '@tinymce/tinymce-svelte';
  import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import Button, { Label } from '@smui/button';
  import Icon from '@iconify/svelte';
  import Select from 'svelte-select';
  import { h } from 'gridjs';
  import Grid from 'gridjs-svelte';
  import type { PageData } from './$types';
  import type { TSnackbarStatus } from '$lib/types/SnackbarStatus';
  import { invalidateAll } from '$app/navigation';
  import type TechStack from '$lib/model/techStack';

  const MODAL_STATES = ['Init', 'Add', 'Edit'] as const;
  type ModalState = (typeof MODAL_STATES)[number];

  export let data: PageData;
  $: techStack = data?.techStack ?? [];
  $: projects = data?.projects ?? [];

  const { pushSnackbar }: { pushSnackbar: (message: string, status: TSnackbarStatus) => void } =
    getContext('snackbar');

  let open = false;

  let textDescription = '';

  let inptName = '';
  let inptDescription = '';
  let inptRepo = '';
  let inptURL = '';
  let inptTechStack: TechStack[] | undefined = [];
  let modalState: ModalState;

  let projectId = '';

  let columns = [
    { name: 'ID' },
    { name: 'Name' },
    { name: 'Description' },
    { name: 'Repo' },
    { name: 'URL' },
    {
      name: 'Tech Stack',
      data: (row: any) => row.tech_stack,
      formatter: (cell: any) => cell.join(', ')
    },
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
                try {
                  projectId = row.cells[0].data;
                  inptName = row.cells[1].data;
                  inptDescription = row.cells[2].data;
                  inptRepo = row.cells[3].data;
                  inptURL = row.cells[4].data;
                  inptTechStack = (row.cells[5].data as string[]).map((val) => {
                    const result = techStack.find((innerVal) => innerVal.name === val);
                    if (result === undefined) throw new Error('Tech stack not found');
                    return result;
                  });
                  modalState = MODAL_STATES[2];
                  open = true;
                } catch (error) {
                  pushSnackbar(`Unable to proceed: ${(error as Error).message}`, 'error');
                }
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

  const groupBy = (val: TechStack) => val.category;

  async function refreshData() {
    invalidateAll();
  }

  async function handDelete(id: string) {
    try {
      let result = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Project deleted successfully!', 'success');
      refreshData();
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleAdd() {
    try {
      let result = await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: inptName,
          description: inptDescription,
          repo: inptRepo,
          url: inptURL,
          tech_stack: inptTechStack?.map((val) => val.name) ?? []
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Project added successfully!', 'success');
      refreshData();
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleEdit() {
    try {
      let result = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: inptName,
          description: inptDescription,
          repo: inptRepo,
          url: inptURL,
          tech_stack: inptTechStack?.map((val) => val.name) ?? []
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Project edited successfully!', 'success');
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
        let descriptionLen = textDescription.trim().length;
        if (nameLen === 0 && descriptionLen === 0) {
          message = 'Name and description is required.';
        } else if (nameLen === 0) {
          message = 'Name is required.';
        } else if (descriptionLen === 0) {
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
  <span class="text-2xl font-semibold">Projects</span>
  <button
    on:click={() => {
      inptName = '';
      inptDescription = '<p></p>';
      inptRepo = '';
      inptURL = '';
      inptTechStack = [];
      modalState = MODAL_STATES[1];
      open = true;
    }}
  >
    <Icon icon="mdi:plus-thick" class="text-3xl text-green-500 hover:text-green-700" />
  </button>
</div>
<Grid
  data={projects}
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
    <Title id="fullscreen-title">Add/Edit Projects</Title>
    <IconButton action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2 flex flex-row flex-wrap gap-3">
        <div class="grow">
          <h2>Name</h2>
          <Textfield bind:value={inptName} class="w-full" />
        </div>
        <div class="grow">
          <h2>Repo</h2>
          <Textfield bind:value={inptRepo} class="w-full" />
        </div>
        <div class="grow">
          <h2>URL</h2>
          <Textfield bind:value={inptURL} class="w-full" />
        </div>
      </div>
      <div class="col-span-2">
        <h2>Description</h2>
        <Editor
          bind:value={inptDescription}
          bind:text={textDescription}
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
      <div class="col-span-2">
        <h2>Tech Stack</h2>
        <Select
          items={techStack}
          multiple={true}
          bind:value={inptTechStack}
          itemId="id"
          label="name"
          {groupBy}
        />
      </div>
    </div>
  </Content>
  <Actions>
    <Button action="" on:click={handleSubmit}>
      <Label>Submit</Label>
    </Button>
  </Actions>
</Dialog>
