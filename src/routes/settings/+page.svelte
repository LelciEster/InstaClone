<script>
  let { form } = $props();
  let confirm = $state(false);
</script>

<svelte:head><title>Einstellungen – Momento</title></svelte:head>

<div class="max-w-lg mx-auto px-4 py-8">

  <h1 class="text-lg font-semibold text-white mb-8">Einstellungen</h1>

  <!-- Account löschen -->
  <div class="border border-neutral-800 rounded-2xl p-6">
    <h2 class="text-sm font-semibold text-white mb-1">Account löschen</h2>
    <p class="text-xs text-neutral-600 mb-5">Dein Account, alle Bilder, Likes und Kommentare werden permanent gelöscht.</p>

    {#if !confirm}
      <button
        onclick={() => confirm = true}
        class="text-sm text-red-500 border border-red-800 px-4 py-2 rounded-lg hover:bg-red-950 transition-colors"
      >
        Account löschen
      </button>

    {:else}
      <form method="POST" action="?/delete" class="flex flex-col gap-3">

        {#if form?.error}
          <p class="text-sm text-red-400">{form.error}</p>
        {/if}

        <p class="text-sm text-neutral-400">Bestätige mit deinem Passwort:</p>

        <input
          type="password"
          name="password"
          placeholder="Passwort"
          required
          class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
        />

        <div class="flex gap-3">
          <button
            type="button"
            onclick={() => confirm = false}
            class="flex-1 text-sm py-2 border border-neutral-700 text-neutral-400 rounded-lg hover:border-neutral-500 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            class="flex-1 text-sm py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Endgültig löschen
          </button>
        </div>

      </form>
    {/if}
  </div>

</div>
