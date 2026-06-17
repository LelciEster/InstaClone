<script>
  let { data } = $props();

  const { profile, images, isOwn } = $derived(data);

  const filters = {
    none: '',
    grayscale: 'grayscale',
    sepia: 'sepia',
    warm: 'brightness-105 saturate-150',
    cool: 'brightness-95 hue-rotate-30'
  };

  let editingImage = $state(null);
  let editDescription = $state('');
  let editFilter = $state('none');

  function openEdit(image) {
    editingImage = image;
    editDescription = image.description ?? '';
    editFilter = image.filter ?? 'none';
  }

  function closeEdit() {
    editingImage = null;
  }
</script>

<svelte:head>
  <title>{profile.username} – Momento</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">

  <!-- ── Profile Header ── -->

  <div class="flex items-center gap-6 mb-10">

    <div class="w-20 h-20 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
      {#if profile.avatar_url}
        <img src={profile.avatar_url} alt={profile.username} class="w-full h-full object-cover"/>
      {:else}
        <span class="text-2xl font-bold text-neutral-400">{profile.username[0].toUpperCase()}</span>
      {/if}
    </div>

    <div class="flex-1">

      <div class="flex items-center gap-4 mb-1">
        <h1 class="text-xl font-bold text-white">{profile.username}</h1>

        {#if isOwn}
          <a href="/settings" class="text-xs text-neutral-400 border border-neutral-700 rounded-lg px-3 py-1">
            Profil bearbeiten
          </a>
        {/if}
      </div>

      {#if profile.first_name}
        <p class="text-sm text-neutral-400 mb-1">{profile.first_name} {profile.last_name ?? ''}</p>
      {/if}

      <p class="text-sm text-neutral-500">{images.length} {images.length === 1 ? 'Beitrag' : 'Beiträge'}</p>

      {#if profile.bio}
        <p class="text-sm text-neutral-300 mt-2">{profile.bio}</p>
      {/if}

    </div>

  </div>

 <!-- ── Image Grid ── -->

  {#if images.length === 0}

    <div class="text-center py-24 text-neutral-700">
      <p class="text-sm">Noch keine Beiträge.</p>

      {#if isOwn}
        <a href="/upload" class="mt-3 inline-block text-sm text-white underline">
          Erstes Bild hochladen
        </a>
      {/if}

    </div>

  {:else}

    <div class="grid grid-cols-3 gap-0.5">

      {#each images as image (image.id)}

        <div class="relative group aspect-square bg-neutral-900 overflow-hidden">

          <a href="/image/{image.id}">

            <img
              src={image.image_url}
              alt={image.description ?? 'Foto'}
              loading="lazy"
              class="w-full h-full object-cover {filters[image.filter] ?? ''} group-hover:opacity-80 transition-opacity"
            />

            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">

              <span class="text-white text-sm font-semibold flex items-center gap-1">
                ♥ {image.votes}
              </span>

            </div>

          </a>


          {#if isOwn}

            <div class="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

              <button
                onclick={() => openEdit(image)}
                class="w-7 h-7 rounded-full bg-black/70 text-white"
              >
                Edit
              </button>

              <form method="POST" action="?/delete">
                <input type="hidden" name="id" value={image.id}/>

                <button
                  type="submit"
                  class="w-7 h-7 rounded-full bg-black/70 text-red-400"
                >
                  Delete
                </button>
              </form>

            </div>

          {/if}

        </div>

      {/each}

    </div>

  {/if}

</div>


  