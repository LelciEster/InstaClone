<script>
  let { data } = $props();

  // CSS-Filter Klassen
  const filters = {
    none: '',
    grayscale: 'grayscale',
    sepia: 'sepia',
    warm: 'brightness-105 saturate-150',
    cool: 'brightness-95 hue-rotate-30'
  };

  function timeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60)    return 'gerade eben';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}T`;
  }
</script>

<svelte:head><title>Momento</title></svelte:head>

<div class="max-w-lg mx-auto px-4 py-8">

  {#if data.images.length === 0}
    <div class="text-center py-24 text-neutral-600">
      <p class="text-sm">Noch keine Bilder.</p>
      {#if data.user}
        <a href="/upload" class="mt-3 inline-block text-sm text-white underline">Erstes Bild hochladen</a>
      {/if}
    </div>

  {:else}
    <div class="flex flex-col gap-10">
      {#each data.images as image (image.id)}

        <!-- Post -->
        <article class="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">

          <!-- Author header -->
          <div class="flex items-center gap-3 px-4 py-3">
            <a href="/profile/{image.username}">
              <div class="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                {#if image.avatar_url}
                  <img src={image.avatar_url} alt={image.username} class="w-full h-full object-cover"/>
                {:else}
                  <span class="text-xs font-bold">{image.username[0].toUpperCase()}</span>
                {/if}
              </div>
            </a>
            <div class="flex-1">
              <a href="/profile/{image.username}" class="text-sm font-semibold text-white hover:underline">
                {image.username}
              </a>
            </div>
            <span class="text-xs text-neutral-600">{timeAgo(image.created_at)}</span>
          </div>

          <!-- Image -->
          <a href="/image/{image.id}">
            <div class="aspect-square bg-neutral-900 overflow-hidden">
              <img
                src={image.image_url}
                alt={image.description ?? 'Foto'}
                loading="lazy"
                class="w-full h-full object-cover {filters[image.filter] ?? ''}"
              />
            </div>
          </a>

          <!-- Actions + Info -->
          <div class="px-4 py-3">

            <!-- Like + Comment buttons -->
            <div class="flex items-center gap-4 mb-2">

              <!-- Like -->
              {#if data.user}
                <form method="POST" action="/image/{image.id}?/like">
                  <button type="submit" class="flex items-center gap-1.5 transition-colors {data.likedIds.includes(image.id) ? 'text-red-500' : 'text-neutral-400 hover:text-white'}">
                    <svg class="w-6 h-6" fill={data.likedIds.includes(image.id) ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>
                </form>
              {:else}
                <a href="/login" class="text-neutral-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </a>
              {/if}

              <!-- Comment (Link zur Detailseite) -->
              <a href="/image/{image.id}#comments" class="text-neutral-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </a>

            </div>

            <!-- Likes count -->
            <p class="text-sm font-semibold text-white mb-1">{image.votes} Likes</p>

            <!-- Description -->
            {#if image.description}
              <p class="text-sm text-neutral-300">
                <a href="/profile/{image.username}" class="font-semibold text-white">{image.username}</a>
                {image.description}
              </p>
            {/if}

            <!-- Comments link -->
            {#if image.comment_count > 0}
              <a href="/image/{image.id}#comments" class="text-xs text-neutral-600 mt-1 block hover:text-neutral-400">
                Alle {image.comment_count} Kommentare ansehen
              </a>
            {/if}

          </div>
        </article>

      {/each}
    </div>
  {/if}

</div>