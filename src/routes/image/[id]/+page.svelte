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