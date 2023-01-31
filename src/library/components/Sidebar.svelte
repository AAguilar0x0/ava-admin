<script>
  import Icon from '@iconify/svelte';
  import routes from '../constants/routes';
</script>

<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" />

<div>
  <div class="flex min-h-screen flex-row bg-gray-100">
    <div class="flex min-w-fit flex-col overflow-hidden bg-white">
      <div class="flex h-20 items-center justify-center">
        <a href="/">
          <h1 class="text-3xl uppercase text-indigo-500">Admin</h1>
        </a>
      </div>
      <ul class="ml-3 mr-14 flex flex-col py-4">
        {#each routes as [title, route, icon]}
          <li>
            <a
              href={route}
              class="flex h-12 transform flex-row items-center gap-2 text-gray-500 transition-transform duration-200 ease-in hover:translate-x-2 hover:text-gray-800"
            >
              <span class="inline-flex h-5 w-5 items-center justify-center text-lg text-gray-400"
                ><Icon {icon} /></span
              >
              <span class="text-sm font-medium">{title}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <div class="grow">
      <slot />
    </div>
  </div>
</div>
