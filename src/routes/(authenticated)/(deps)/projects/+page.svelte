<script lang="ts">
  import { getContext } from 'svelte';
  import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import Button, { Label } from '@smui/button';
  import Select, { Option } from '@smui/select';
  import Icon from '@iconify/svelte';
  import { h } from 'gridjs';
  import Grid from 'gridjs-svelte';
  import type { PageData } from './$types';
  import type { TSnackbarStatus } from '$lib/types/SnackbarStatus';
  import { invalidateAll } from '$app/navigation';

  const MODAL_STATES = ['Init', 'Add', 'Edit'] as const;
  type ModalState = (typeof MODAL_STATES)[number];

  export let data: PageData;
  $: techStack = new Set(data?.techStack?.map((val) => val.name) ?? []);
  $: projects = data?.projects ?? [];

  const { pushSnackbar }: { pushSnackbar: (message: string, status: TSnackbarStatus) => void } =
    getContext('snackbar');

  let open = false;

  let techStackInput: string | undefined = '';

  let inptName = '';
  let inptCompany = '';
  let inptRepo = '';
  let inptURL = '';
  let inptTechStack: Set<string> = new Set();
  let modalState: ModalState;

  let projectId = '';

  let columns = [
    { name: 'ID', sort: true },
    { name: 'Name', sort: true },
    { name: 'Company', sort: true },
    { name: 'Repo', sort: true },
    { name: 'URL', sort: true },
    {
      name: 'Tech Stack',
      sort: true,
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
                projectId = row.cells[0].data;
                inptName = row.cells[1].data;
                inptCompany = row.cells[2].data;
                inptRepo = row.cells[3].data;
                inptURL = row.cells[4].data;
                inptTechStack = new Set(row.cells[5].data);
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
          company: inptCompany,
          repo: inptRepo,
          url: inptURL,
          tech_stack: Array.from(inptTechStack)
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
          company: inptCompany,
          repo: inptRepo,
          url: inptURL,
          tech_stack: Array.from(inptTechStack)
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
        let companyLen = inptCompany.trim().length;
        if (nameLen === 0 && companyLen === 0) {
          message = 'Name and company is required.';
        } else if (nameLen === 0) {
          message = 'Name is required.';
        } else if (companyLen === 0) {
          message = 'Company is required.';
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
  <span class="text-2xl font-semibold">Projects</span>
  <button
    on:click={() => {
      inptName = '';
      inptCompany = '';
      inptRepo = '';
      inptURL = '';
      inptTechStack = new Set();
      modalState = MODAL_STATES[1];
      open = true;
    }}
  >
    <Icon icon="mdi:plus-thick" class="text-3xl text-green-500 hover:text-green-700" />
  </button>
</div>
<Grid data={projects} fixedHeader search resizable pagination {columns} />
<Dialog bind:open fullscreen>
  <Header>
    <Title id="fullscreen-title">Add/Edit Projects</Title>
    <IconButton action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <h2>Name</h2>
        <Textfield bind:value={inptName} class="w-full" />
      </div>
      <div>
        <h2>Company</h2>
        <Textfield bind:value={inptCompany} class="w-full" />
      </div>
      <div>
        <h2>Repo</h2>
        <Textfield bind:value={inptRepo} class="w-full" />
      </div>
      <div>
        <h2>URL</h2>
        <Textfield bind:value={inptURL} class="w-full" />
      </div>
      <h2 class="col-span-2">Tech Stack</h2>
      <div class="inline-flex h-fit">
        <Select bind:value={techStackInput} class="w-full">
          {#each Array.from(techStack).filter((value) => !inptTechStack.has(value)) as tech}
            <Option value={tech}>{tech}</Option>
          {/each}
        </Select>
        <button
          disabled={!techStackInput || techStackInput.trim().length === 0}
          on:click={() => {
            // @ts-ignore - because this wont execute if the button is disabled which also happens when the variable is undefined
            inptTechStack.add(techStackInput);
            inptTechStack = inptTechStack;
            techStackInput = '';
          }}
        >
          <Icon
            icon="mdi:plus-thick"
            class={`text-3xl ${
              !techStackInput || techStackInput.trim().length === 0
                ? ''
                : 'text-green-500 hover:text-green-700'
            }`}
          />
        </button>
      </div>
      <div>
        <div class="flex flex-col gap-1">
          {#each Array.from(inptTechStack) as techStack}
            <div class="flex flex-row flex-wrap justify-between bg-neutral-50 rounded-sm px-1">
              <span>{techStack}</span>
              <button
                on:click={() => {
                  inptTechStack.delete(techStack);
                  inptTechStack = inptTechStack;
                }}
              >
                <Icon icon="mdi:minus-thick" class="text-red-500 hover:text-red-700" />
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </Content>
  <Actions>
    <Button action="" on:click={handleSubmit}>
      <Label>Submit</Label>
    </Button>
  </Actions>
</Dialog>
