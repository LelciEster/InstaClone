<script>
  import { page } from '$app/stores';
 
  let { data, children } = $props();
  let user = $derived(data.user);
 
  // Active route highlight helper
  function active(path) {
    return $page.url.pathname === path;
  }
</script>
 
<div class="min-h-screen bg-black text-white flex">
 
  <!-- ── Sidebar ── -->
  {#if user}
    <aside class="hidden md:flex flex-col w-56 border-r border-neutral-800 px-4 py-8 sticky top-0 h-screen shrink-0">
 
      <!-- Logo -->
      <a href="/" class="text-2xl font-black tracking-tighter text-white mb-10 px-2" style="font-family:'Georgia',serif">
        momento
      </a>
 
      <!-- Nav links -->
      <nav class="flex flex-col gap-1 flex-1">
 
        <!-- Home -->
        <a href="/" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors {active('/') ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
          <svg class="w-6 h-6 shrink-0" fill={active('/') ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-sm">Home</span>
        </a>
 
        <!-- Search -->
        <a href="/search" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors {active('/search') ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
          <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span class="text-sm">Suche</span>
        </a>
 
        <!-- Upload -->
        <a href="/upload" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors {active('/upload') ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
          <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="text-sm">Hochladen</span>
        </a>
 
        <!-- Profile -->
        <a href="/profile/{user.username}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors {$page.url.pathname === `/profile/${user.username}` ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
          <div class="w-6 h-6 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center shrink-0">
            {#if user.avatar_url}
              <img src={user.avatar_url} alt={user.username} class="w-full h-full object-cover"/>
            {:else}
              <span class="text-[10px] font-bold">{user.username[0].toUpperCase()}</span>
            {/if}
          </div>
          <span class="text-sm">Profil</span>
        </a>
 
        <!-- Admin (nur für Admins) -->
        {#if user.role === 'admin'}
          <a href="/admin" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-amber-400 hover:bg-neutral-900">
            <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-sm">Admin</span>
          </a>
        {/if}

              </nav>