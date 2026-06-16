<script>
  let { form } = $props();

  let preview      = $state(null);
  let uploading    = $state(false);
  let selectedFilter = $state('none');

  // Tailwind CSS-Filter Klassen
  const filters = {
    none:      { label: 'Normal',   class: '' },
    grayscale: { label: 'S/W',      class: 'grayscale' },
    sepia:     { label: 'Sepia',    class: 'sepia' },
    warm:      { label: 'Warm',     class: 'brightness-105 saturate-150' },
    cool:      { label: 'Cool',     class: 'brightness-95 hue-rotate-30' }
  };

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) preview = URL.createObjectURL(file);
  }
</script>

<svelte:head><title>Hochladen – Momento</title></svelte:head>

<div class="max-w-lg mx-auto px-4 py-10">

  <h1 class="text-lg font-semibold text-white mb-6">Neues Bild</h1>

  {#if form?.error}
    <p class="mb-4 text-sm text-red-400">{form.error}</p>
  {/if}

  <form
    method="POST" action="?/upload"
    enctype="multipart/form-data"
    onsubmit={() => uploading = true}
    class="flex flex-col gap-5"
  >

    <!-- Datei-Picker -->
    <label class="cursor-pointer border border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center aspect-square bg-neutral-950 hover:border-neutral-500 transition-colors overflow-hidden">
      {#if preview}
        <img
          src={preview}
          alt="Vorschau"
          class="w-full h-full object-cover {filters[selectedFilter].class}"
        />
      {:else}
        <svg class="w-8 h-8 text-neutral-600 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        <span class="text-sm text-neutral-600">Bild auswählen</span>
      {/if}
      <input type="file" name="image" accept="image/*" onchange={handleFile} class="hidden" required/>
    </label>

    <!-- Filter (nur wenn Bild gewählt) -->
    {#if preview}
      <div>
        <p class="text-xs text-neutral-500 mb-3 uppercase tracking-widest">Filter</p>
        <div class="flex gap-2">
          {#each Object.entries(filters) as [key, f]}
            <button
              type="button"
              onclick={() => selectedFilter = key}
              class="flex flex-col items-center gap-1.5 flex-1"
            >
              <div class="w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors {selectedFilter === key ? 'border-white' : 'border-transparent'}">
                <img src={preview} alt={f.label} class="w-full h-full object-cover {f.class}"/>
              </div>
              <span class="text-[10px] {selectedFilter === key ? 'text-white' : 'text-neutral-600'}">{f.label}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Verstecktes Filter-Feld -->
    <input type="hidden" name="filter" value={selectedFilter}/>

    <!-- Description -->
    <textarea
      name="description"
      placeholder="Beschreibung hinzufügen..."
      rows="3"
      class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
    ></textarea>

    <!-- Submit -->
    <button
      type="submit"
      disabled={uploading}
      class="w-full bg-white text-black text-sm font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 active:scale-[0.98]"
    >
      {uploading ? 'Wird hochgeladen...' : 'Teilen'}
    </button>

  </form>
</div>