<script>
  let { data } = $props();
</script>

<svelte:head><title>Suche – Momento</title></svelte:head>

<div class="max-w-lg mx-auto px-4 py-8">

  <h1 class="text-lg font-semibold text-white mb-6">Suche</h1>

  <!-- Suchfeld -->
  <form method="GET" class="mb-8">
    <div class="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 gap-3 focus-within:border-neutral-600 transition-colors">
      <svg class="w-4 h-4 text-neutral-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        type="text"
        name="q"
        value={data.query}
        placeholder="User suchen..."
        autofocus
        class="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none"
      />
      {#if data.query}
        <a href="/search" class="text-neutral-600 hover:text-white transition-colors text-xs">✕</a>
      {/if}
    </div>
  </form>

  <!-- Ergebnisse -->
  {#if data.query && data.results.length === 0}
    <p class="text-sm text-neutral-600 text-center py-10">Kein User gefunden für „{data.query}"</p>

  {:else if data.results.length > 0}
    <div class="flex flex-col gap-1">
      {#each data.results as user (user.username)}
        <a
          href="/profile/{user.username}"
          class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-900 transition-colors"
        >
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
            {#if user.avatar_url}
              <img src={user.avatar_url} alt={user.username} class="w-full h-full object-cover"/>
            {:else}
              <span class="text-sm font-bold text-neutral-400">{user.username[0].toUpperCase()}</span>
            {/if}
          </div>

          <!-- Info -->
          <div>
            <p class="text-sm font-semibold text-white">{user.username}</p>
            {#if user.first_name}
              <p class="text-xs text-neutral-500">{user.first_name} {user.last_name ?? ''}</p>
            {/if}
          </div>
        </a>
      {/each}
    </div>

  {:else}
    <!-- Leer-Zustand -->
    <p class="text-sm text-neutral-700 text-center py-10">Gib einen Namen oder Benutzernamen ein.</p>
  {/if}

</div>