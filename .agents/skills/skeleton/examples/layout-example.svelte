<!-- Svelte 5 + Skeleton v5 Application Layout Example -->
<script lang="ts">
  import { AppBar, Avatar, Navigation, Switch } from '@skeletonlabs/skeleton-svelte';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import SunIcon from '@lucide/svelte/icons/sun';
  import BellIcon from '@lucide/svelte/icons/bell';

  let currentTheme = $state('cerberus');
  let isDarkMode = $state(false);

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function changeTheme(newTheme: string) {
    currentTheme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
  }
</script>

<div class="min-h-screen bg-surface-50-950 text-surface-950-50 flex flex-col">
  <!-- App Header -->
  <header class="border-b border-surface-200-800 bg-surface-100-900/60 backdrop-blur sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="font-bold text-xl tracking-tight text-primary-500">MyApp</span>
      <span class="badge badge-sm preset-tonal-primary">v5.0</span>
    </div>

    <div class="flex items-center gap-4">
      <!-- Theme Selector -->
      <select 
        class="select select-sm max-w-[140px]" 
        value={currentTheme} 
        onchange={(e) => changeTheme(e.currentTarget.value)}
      >
        <option value="cerberus">Cerberus</option>
        <option value="mona">Mona</option>
        <option value="vox">Vox</option>
        <option value="dracula">Dracula</option>
        <option value="rosepine">Rose Pine</option>
      </select>

      <!-- Dark Mode Toggle -->
      <button 
        type="button" 
        class="btn btn-sm preset-tonal" 
        onclick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {#if isDarkMode}
          <SunIcon class="size-4" />
        {:else}
          <MoonIcon class="size-4" />
        {/if}
      </button>

      <!-- User Profile -->
      <Avatar class="size-elem-base">
        <Avatar.Image src="https://i.pravatar.cc/150?img=33" alt="User avatar" />
        <Avatar.Fallback class="preset-filled-primary-500">DG</Avatar.Fallback>
      </Avatar>
    </div>
  </header>

  <!-- Layout Body -->
  <div class="flex-1 flex">
    <!-- Sidebar Navigation -->
    <aside class="w-64 border-r border-surface-200-800 p-4 space-y-2 hidden md:block">
      <nav class="space-y-1">
        <a href="#dashboard" class="flex items-center gap-3 px-3 py-2 rounded-base preset-filled-primary-500 font-medium">
          Dashboard
        </a>
        <a href="#projects" class="flex items-center gap-3 px-3 py-2 rounded-base hover:bg-surface-200-800 transition">
          Projects
        </a>
        <a href="#analytics" class="flex items-center gap-3 px-3 py-2 rounded-base hover:bg-surface-200-800 transition">
          Analytics
        </a>
        <a href="#settings" class="flex items-center gap-3 px-3 py-2 rounded-base hover:bg-surface-200-800 transition">
          Settings
        </a>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-8 space-y-6 max-w-6xl">
      <div>
        <h1 class="h2 font-bold text-surface-950-50">Welcome Back</h1>
        <p class="text-surface-600-400">Here is your project overview and recent activity.</p>
      </div>

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card preset-outlined-surface-200-800 bg-surface-100-900 p-6 space-y-2">
          <span class="text-xs uppercase tracking-wider text-surface-500">Total Users</span>
          <p class="text-3xl font-extrabold text-primary-500">12,450</p>
          <span class="badge badge-sm preset-tonal-success">+18% this month</span>
        </div>

        <div class="card preset-outlined-surface-200-800 bg-surface-100-900 p-6 space-y-2">
          <span class="text-xs uppercase tracking-wider text-surface-500">Active Workspaces</span>
          <p class="text-3xl font-extrabold text-secondary-500">84</p>
          <span class="badge badge-sm preset-tonal-primary">Stable</span>
        </div>

        <div class="card preset-outlined-surface-200-800 bg-surface-100-900 p-6 space-y-2">
          <span class="text-xs uppercase tracking-wider text-surface-500">API Requests</span>
          <p class="text-3xl font-extrabold text-tertiary-500">1.2M</p>
          <span class="badge badge-sm preset-tonal-warning">92% of quota</span>
        </div>
      </div>
    </main>
  </div>
</div>
