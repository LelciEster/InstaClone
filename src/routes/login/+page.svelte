<script>
  let { form } = $props();
</script>

<svelte:head>
  <title>Anmelden – Momento</title>
</svelte:head>

<!-- Split layout: Form links, Bild rechts -->
<div class="min-h-screen flex flex-col md:flex-row">

  <!-- Linke Seite: Form -->
  <div class="w-full md:w-[420px] bg-neutral-950 flex flex-col justify-center px-10 sm:px-14 py-16 shrink-0">

    <!-- Logo -->
    <div class="mb-12">
      <h1 class="text-4xl font-black text-white tracking-tighter" style="font-family: 'Georgia', serif; letter-spacing: -1.5px;">
        momento
      </h1>
      <p class="text-neutral-600 text-xs tracking-widest uppercase mt-1">Share your world</p>
    </div>

    <h2 class="text-xl font-semibold text-white mb-1">Willkommen zurück</h2>
    <p class="text-neutral-500 text-sm mb-8">Melde dich bei deinem Konto an.</p>

    <!-- Fehlermeldung -->
    {#if form?.error}
      <div class="mb-6 text-red-400 text-sm">
        {form.error}
      </div>
    {/if}

    <form method="POST" action="?/login" class="flex flex-col gap-3">

      <input
        type="email"
        name="email"
        placeholder="E-Mail-Adresse"
        required
        class="w-full bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors"
      />

      <input
        type="password"
        name="password"
        placeholder="Passwort"
        required
        class="w-full bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors"
      />

      <button
        type="submit"
        class="mt-1 w-full bg-white text-neutral-950 text-sm font-semibold py-3 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all"
      >
        Anmelden
      </button>

    </form>

    <!-- Divider -->
    <div class="flex items-center gap-4 my-7">
      <div class="flex-1 h-px bg-neutral-800"></div>
      <span class="text-neutral-600 text-xs tracking-widest uppercase">oder</span>
      <div class="flex-1 h-px bg-neutral-800"></div>
    </div>

    <p class="text-neutral-500 text-sm text-center">
      Noch kein Konto?
      <a href="/register" class="text-white font-semibold hover:text-neutral-300 transition-colors">Registrieren</a>
    </p>
  </div>

  <!-- Rechte Seite: Dekorativ / Bild -->
  <div class="hidden md:flex flex-1 bg-neutral-900 items-center justify-center relative overflow-hidden">

    <!-- Subtile Hintergrund-Elemente -->
    <div class="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950"></div>

    <!-- Gitter-Pattern -->
    <div class="absolute inset-0 opacity-5"
      style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;">
    </div>

    <!-- Große dekorative Kreise -->
    <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
    <div class="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>

    <!-- Zitat / Content -->
    <div class="relative z-10 text-center px-16 max-w-lg">
      <div class="w-12 h-px bg-white/30 mx-auto mb-8"></div>
      <p class="text-white/80 text-3xl leading-snug font-light" style="font-family: 'Georgia', serif;">
        Jeder Moment<br>verdient es,<br>erinnert zu werden.
      </p>
      <div class="w-12 h-px bg-white/30 mx-auto mt-8"></div>

      <!-- Dummy Foto-Grid Dekoration -->
      <div class="mt-12 grid grid-cols-3 gap-2 opacity-20">
        {#each Array(9) as _}
          <div class="aspect-square rounded-md bg-white/30"></div>
        {/each}
      </div>
    </div>

  </div>

</div>
