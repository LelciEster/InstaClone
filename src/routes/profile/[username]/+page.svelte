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


  