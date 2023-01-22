<script>
  import Icon from '@iconify/svelte';
  import routes from '../constants/routes';
</script>

<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" />

<div>
  <div class="min-h-screen flex flex-row bg-gray-100">
    <div class="flex flex-col min-w-fit bg-white overflow-hidden">
      <div class="flex items-center justify-center h-20">
        <a href="/">
          <h1 class="text-3xl uppercase text-indigo-500">Admin</h1>
        </a>
      </div>
      <ul class="flex flex-col py-4 ml-3 mr-14">
        {#each routes as [title, route, icon]}
          <li>
            <a
              href={route}
              class="flex flex-row items-center h-12 gap-2 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
            >
              <span class="inline-flex items-center justify-center w-5 h-5 text-lg text-gray-400"
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
