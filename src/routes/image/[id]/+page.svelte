<script>
  import { enhance } from '$app/forms';
 
  let { data } = $props();
 
  const filters = {
    none: '', grayscale: 'grayscale', sepia: 'sepia',
    warm: 'brightness-105 saturate-150', cool: 'brightness-95 hue-rotate-30'
  };
 
  function timeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60)    return 'gerade eben';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}T`;
  }
 
  // Report modal
  let reportOpen   = $state(false);
  let reportReason = $state('spam');
  let reportMsg    = $state('');
  let reportDone   = $state(false);
 
  const reasons = [
    { value: 'spam',      label: 'Spam' },
    { value: 'hate',      label: 'Hassrede' },
    { value: 'nudity',    label: 'Nacktheit' },
    { value: 'violence',  label: 'Gewalt' },
  ];
</script>
 
<svelte:head><title>{data.image.username} – Momento</title></svelte:head>
 
<!-- Report Modal -->
{#if reportOpen}
  <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onclick={() => reportOpen = false} role="dialog">
    <div class="bg-neutral-900 rounded-2xl p-6 w-full max-w-sm" onclick={(e) => e.stopPropagation()} role="presentation">
 
      {#if reportDone}
        <p class="text-center text-white text-sm py-4">Danke für deine Meldung.</p>
        <button onclick={() => { reportOpen = false; reportDone = false; }} class="w-full text-sm py-2 bg-neutral-800 text-white rounded-lg mt-2">Schliessen</button>
      {:else}
        <h2 class="text-white font-semibold mb-4">Bild melden</h2>
 
        <!-- Grund auswählen -->
        <div class="flex flex-col gap-2 mb-4">
          {#each reasons as r}
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" bind:group={reportReason} value={r.value} class="accent-white"/>
              <span class="text-sm text-neutral-300">{r.label}</span>
            </label>
          {/each}
        </div>
 
        <!-- Optionale Nachricht -->
        <textarea
          bind:value={reportMsg}
          placeholder="Zusätzliche Infos (optional)"
          rows="2"
          class="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none resize-none mb-4"
        ></textarea>
 
        <form method="POST" action="?/report" use:enhance={() => {
          return ({ result }) => {
            if (result.type === 'success') reportDone = true;
          };
        }}>
          <input type="hidden" name="reason"  value={reportReason}/>
          <input type="hidden" name="message" value={reportMsg}/>
          <div class="flex gap-3">
            <button type="button" onclick={() => reportOpen = false} class="flex-1 text-sm py-2 border border-neutral-700 text-neutral-400 rounded-lg">Abbrechen</button>
            <button type="submit" class="flex-1 text-sm py-2 bg-white text-black font-semibold rounded-lg">Melden</button>
          </div>
        </form>
      {/if}
 
    </div>
  </div>
{/if}

<!-- Seite -->
<div class="max-w-lg mx-auto px-4 py-8">
 
  <!-- Author header -->
  <div class="flex items-center gap-3 mb-4">
    <a href="/profile/{data.image.username}">
      <div class="w-9 h-9 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center">
        {#if data.image.avatar_url}
          <img src={data.image.avatar_url} alt={data.image.username} class="w-full h-full object-cover"/>
        {:else}
          <span class="text-sm font-bold">{data.image.username[0].toUpperCase()}</span>
        {/if}
      </div>
    </a>
    <a href="/profile/{data.image.username}" class="text-sm font-semibold text-white hover:underline flex-1">
      {data.image.username}
    </a>
    <span class="text-xs text-neutral-600">{timeAgo(data.image.created_at)}</span>
 
    <!-- Report Button (nur für eingeloggte, nicht eigene Bilder) -->
    {#if data.user && data.user.username !== data.image.username}
      <button onclick={() => reportOpen = true} class="ml-2 text-neutral-600 hover:text-neutral-400 transition-colors" title="Melden">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 21V5a2 2 0 012-2h9l5 5v13"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 3v5h5"/>
        </svg>
      </button>
    {/if}
  </div>
 
  <!-- Bild -->
  <div class="rounded-xl overflow-hidden aspect-square bg-neutral-900 mb-4">
    <img
      src={data.image.image_url}
      alt={data.image.description ?? 'Foto'}
      class="w-full h-full object-cover {filters[data.image.filter] ?? ''}"
    />
  </div>
 
  <!-- Actions -->
  <div class="flex items-center gap-4 mb-3">
 
    {#if data.user}
      <!-- Like -->
      <form method="POST" action="?/like">
        <button type="submit" class="transition-colors {data.hasLiked ? 'text-red-500' : 'text-neutral-400 hover:text-white'}">
          <svg class="w-6 h-6" fill={data.hasLiked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </form>
    {/if}
 
    <!-- Comment -->
    <a href="#comments" class="text-neutral-400 hover:text-white transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    </a>
 
    {#if data.user}
      <!-- Save -->
      <form method="POST" action="?/save" class="ml-auto">
        <button type="submit" class="transition-colors {data.hasSaved ? 'text-white' : 'text-neutral-400 hover:text-white'}">
          <svg class="w-6 h-6" fill={data.hasSaved ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </button>
      </form>
    {/if}
 
  </div>
 
  <!-- Likes -->
  <p class="text-sm font-semibold text-white mb-1">{data.image.votes} Likes</p>
 
  <!-- Description -->
  {#if data.image.description}
    <p class="text-sm text-neutral-300 mb-6">
      <a href="/profile/{data.image.username}" class="font-semibold text-white">{data.image.username}</a>
      {' '}{data.image.description}
    </p>
  {/if}