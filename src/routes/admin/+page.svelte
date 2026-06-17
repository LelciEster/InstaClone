<script>
  let { data } = $props();

  const reasonLabel = {
    spam: 'Spam', hate: 'Hassrede', nudity: 'Nacktheit', violence: 'Gewalt'
  };

  function timeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}T`;
  }
</script>

<svelte:head><title>Admin – Momento</title></svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">

  <div class="flex items-center justify-between mb-8">
    <h1 class="text-lg font-semibold text-white">Admin</h1>
    <span class="text-xs text-neutral-600">{data.reports.length} offene Reports</span>
  </div>

  {#if data.reports.length === 0}
    <div class="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
      <p class="text-neutral-600 text-sm">Keine Reports vorhanden.</p>
    </div>

  {:else}
    <div class="flex flex-col gap-4">
      {#each data.reports as report (report.id)}
        <div class="border border-neutral-800 rounded-2xl overflow-hidden">

          <!-- Bild + Info -->
          <div class="flex gap-4 p-4">
            <a href="/image/{report.image_id}">
              <img
                src={report.image_url}
                alt="gemeldetes Bild"
                class="w-16 h-16 object-cover rounded-lg bg-neutral-900 shrink-0"
              />
            </a>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-amber-400 uppercase tracking-wide">{reasonLabel[report.reason]}</span>
                <span class="text-xs text-neutral-600">{timeAgo(report.created_at)}</span>
              </div>
              <p class="text-xs text-neutral-500">
                Gemeldet von <a href="/profile/{report.reporter}" class="text-white hover:underline">{report.reporter}</a>
                · Bild von <a href="/profile/{report.author}" class="text-white hover:underline">{report.author}</a>
              </p>
              {#if report.message}
                <p class="text-xs text-neutral-500 mt-1 italic">„{report.message}"</p>
              {/if}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex border-t border-neutral-800">

            <!-- Report schliessen -->
            <form method="POST" action="?/dismiss" class="flex-1">
              <input type="hidden" name="id" value={report.id}/>
              <button type="submit" class="w-full text-xs py-3 text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors">
                Ignorieren
              </button>
            </form>

            <div class="w-px bg-neutral-800"></div>

            <!-- Bild löschen -->
            <form method="POST" action="?/deleteImage" class="flex-1">
              <input type="hidden" name="image_id" value={report.image_id}/>
              <button
                type="submit"
                onclick={(e) => { if (!confirm('Bild wirklich löschen?')) e.preventDefault(); }}
                class="w-full text-xs py-3 text-red-500 hover:bg-neutral-900 transition-colors"
              >
                Bild löschen
              </button>
            </form>

            <div class="w-px bg-neutral-800"></div>

            <!-- User bannen -->
            <form method="POST" action="?/ban" class="flex-1">
              <input type="hidden" name="username" value={report.author}/>
              <button
                type="submit"
                onclick={(e) => { if (!confirm(`${report.author} wirklich sperren?`)) e.preventDefault(); }}
                class="w-full text-xs py-3 text-red-500 hover:bg-neutral-900 transition-colors"
              >
                User sperren
              </button>
            </form>

          </div>
        </div>
      {/each}
    </div>
  {/if}

</div>
