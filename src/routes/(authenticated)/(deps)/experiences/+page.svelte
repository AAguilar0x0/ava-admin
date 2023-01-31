<script lang="ts">
  import { getContext } from 'svelte';
  import Editor from '@tinymce/tinymce-svelte';
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
  $: experiences = data?.experiences ?? [];

  const { pushSnackbar }: { pushSnackbar: (message: string, status: TSnackbarStatus) => void } =
    getContext('snackbar');

  let open = false;

  let techStackInput: string | undefined = '';
  let textDescription = '';

  let inptRole = '';
  let inptCompany = '';
  let inptDescription = '';
  let inptStart = '';
  let inptEnd = '';
  let inptTechStack: Set<string> = new Set();
  let modalState: ModalState;

  let experienceId = '';

  let columns = [
    { name: 'ID' },
    { name: 'Role' },
    { name: 'Company' },
    {
      name: 'Description',
      attributes: (cell: any) => {
        if (cell) {
          return {
            style: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'
          };
        }
      }
    },
    {
      name: 'Start',
      sort: true,
      formatter: (cell: string) =>
        cell.length === 0
          ? '—'
          : new Date(cell).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
    },
    {
      name: 'End',
      sort: true,
      formatter: (cell: string) =>
        cell.length === 0
          ? '—'
          : new Date(cell).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
    },
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
                experienceId = row.cells[0].data;
                inptRole = row.cells[1].data;
                inptCompany = row.cells[2].data;
                inptDescription = row.cells[3].data;
                inptStart = row.cells[4].data.split(':', 2).join(':');
                inptEnd = row.cells[5].data.split(':', 2).join(':');
                inptTechStack = new Set(row.cells[6].data);
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
      let result = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Experience deleted successfully!', 'success');
      refreshData();
      open = false;
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleAdd() {
    try {
      let result = await fetch('/api/experiences', {
        method: 'POST',
        body: JSON.stringify({
          role: inptRole,
          company: inptCompany,
          description: inptDescription,
          start: new Date(inptStart).toISOString(),
          end: inptEnd.length === 0 ? '' : new Date(inptEnd).toISOString(),
          tech_stack: Array.from(inptTechStack)
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Experience added successfully!', 'success');
      refreshData();
      open = false;
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleEdit() {
    try {
      let result = await fetch(`/api/experiences/${experienceId}`, {
        method: 'PUT',
        body: JSON.stringify({
          role: inptRole,
          company: inptCompany,
          description: inptDescription,
          start: new Date(inptStart).toISOString(),
          end: inptEnd.length === 0 ? '' : new Date(inptEnd).toISOString(),
          tech_stack: Array.from(inptTechStack)
        })
      });
      if (!result.ok) throw new Error(result.statusText);
      pushSnackbar('Experience edited successfully!', 'success');
      refreshData();
      open = false;
    } catch (error) {
      pushSnackbar(`Error: ${(error as Error)?.message ?? (error as Error).name}`, 'error');
    }
  }

  async function handleSubmit() {
    switch (modalState) {
      case MODAL_STATES[1]:
      case MODAL_STATES[2]:
        let roleLen = inptRole.trim().length;
        let companyLen = inptCompany.trim().length;
        let descriptionLen = textDescription.trim().length;
        let startLen = inptStart.trim().length;
        if (roleLen === 0 || companyLen === 0 || descriptionLen === 0 || startLen === 0) {
          pushSnackbar('Please fill out all required fields marked with *', 'error');
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
  }
</script>

<div class="flex-inline flex flex-wrap gap-1">
  <span class="text-2xl font-semibold">Experiences</span>
  <button
    on:click={() => {
      inptRole = '';
      inptCompany = '';
      inptDescription = '';
      inptStart = '';
      inptEnd = '';
      inptTechStack = new Set();
      modalState = MODAL_STATES[1];
      open = true;
    }}
  >
    <Icon icon="mdi:plus-thick" class="text-3xl text-green-500 hover:text-green-700" />
  </button>
</div>
<Grid data={experiences} {columns} fixedHeader search resizable pagination sort />
<Dialog bind:open fullscreen>
  <Header>
    <Title id="fullscreen-title">Add/Edit Experiences</Title>
    <IconButton action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <h2>Role*</h2>
        <Textfield bind:value={inptRole} class="w-full" />
      </div>
      <div>
        <h2>Company*</h2>
        <Textfield bind:value={inptCompany} class="w-full" />
      </div>
      <div>
        <h2>Start*</h2>
        <Textfield bind:value={inptStart} type="datetime-local" class="w-full" />
      </div>
      <div>
        <h2>End</h2>
        <Textfield bind:value={inptEnd} type="datetime-local" class="w-full" />
      </div>
      <div class="col-span-2">
        <h2>Description*</h2>
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
            <div class="flex flex-row flex-wrap justify-between rounded-sm bg-neutral-50 px-1">
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
