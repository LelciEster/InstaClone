<script>
  let { data } = $props();
</script>

<svelte:head><title>Gespeichert – Momento</title></svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">

  <h1 class="text-lg font-semibold text-white mb-8">Gespeichert</h1>

  {#if data.saved.length === 0}
    <div class="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
      <p class="text-neutral-600 text-sm">Noch nichts gespeichert.</p>
    </div>
  {:else}
    <div class="grid grid-cols-3 gap-0.5 rounded-xl overflow-hidden">
      {#each data.saved as post (post.id)}
        <a href="/image/{post.id}" class="aspect-square bg-neutral-900 overflow-hidden block">
          <img src={post.image_url} alt={post.description ?? 'Foto'} class="w-full h-full object-cover hover:opacity-80 transition-opacity"/>
        </a>
      {/each}
    </div>
  {/if}

</div>
