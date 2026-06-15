<script>
  let { form } = $props();
</script>

<svelte:head>
  <title>Registrieren – Momento</title>
</svelte:head>

<div class="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-12">
  <div class="w-full max-w-sm">

    <!-- Logo -->
    <div class="text-center mb-8">
      <span class="text-3xl font-bold tracking-tight text-stone-800">momento</span>
      <p class="text-sm text-stone-500 mt-1">Teile deine Momente.</p>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-8">

      <h1 class="text-lg font-semibold text-stone-800 mb-6">Konto erstellen</h1>

      <!-- Fehlermeldung -->
      {#if form?.error}
        <div class="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {form.error}
        </div>
      {/if}

      <form method="POST" action='?/signup' class="flex flex-col gap-3">

        <!-- Vorname / Nachname nebeneinander -->
        <div class="flex gap-3">
          <input
            type="text"
            name="first_name"
            placeholder="Vorname"
            required
            class="w-1/2 px-3 py-2.5 text-sm border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Nachname"
            required
            class="w-1/2 px-3 py-2.5 text-sm border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
          />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Benutzername"
          required
          class="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
        />

        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          required
          class="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Passwort"
          required
          class="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
        />

        <button
          type="submit"
          class="mt-2 w-full bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Registrieren
        </button>

      </form>
    </div>

    <!-- Link zu Login -->
    <p class="text-center text-sm text-stone-500 mt-5">
      Bereits ein Konto?
      <a href="/login" class="text-stone-800 font-medium hover:underline">Anmelden</a>
    </p>

  </div>
</div>