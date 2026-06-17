<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { data, children } = $props();

	let user = $derived(data?.user);

	const active = (path) => $page.url.pathname === path;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-black text-white flex flex-col">

	<!-- ── Header for logged-out users ── -->
	{#if !user}
		<header class="border-b border-neutral-800 px-6 py-4 flex items-center justify-between shrink-0">
			<a href="/" class="text-xl font-black tracking-tighter" style="font-family:'Georgia',serif">momento</a>
			<div class="flex gap-3">
				<a href="/login" class="text-sm text-neutral-400 hover:text-white transition-colors px-4 py-1.5 rounded-lg hover:bg-neutral-900">
					Anmelden
				</a>
				<a href="/signup" class="text-sm bg-white text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors">
					Registrieren
				</a>
			</div>
		</header>
	{/if}

	<div class="flex flex-1">

		<!-- ── Sidebar ── -->
		{#if user}
			<aside class="hidden md:flex flex-col w-56 border-r border-neutral-800 px-4 py-8 sticky top-0 h-screen shrink-0">

				<a href="/" class="text-2xl font-black tracking-tighter mb-10 px-2" style="font-family:'Georgia',serif">
					momento
				</a>

				<nav class="flex flex-col gap-1 flex-1">

					<a href="/"
						class="px-3 py-2.5 rounded-xl {active('/') ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
						Home
					</a>

					<a href="/search"
						class="px-3 py-2.5 rounded-xl {active('/search') ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
						Suche
					</a>

					<a href="/upload"
						class="px-3 py-2.5 rounded-xl {active('/upload') ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
						Hochladen
					</a>

					<a href={`/profile/${user.username}`}
						class="px-3 py-2.5 rounded-xl {$page.url.pathname === `/profile/${user.username}` ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
						Profil
					</a>

					<a href="/saved"
						class="px-3 py-2.5 rounded-xl {active('/saved') ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
						Gespeichert
					</a>

					{#if user.role === 'admin'}
						<a href="/admin" class="px-3 py-2.5 text-amber-400 hover:bg-neutral-900 rounded-xl">
							Admin
						</a>
					{/if}

				</nav>

				<a href="/settings"
					class="px-3 py-2.5 rounded-xl mb-2 {active('/settings') ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
					Einstellungen
				</a>

				<form method="POST" action="/logout">
					<button class="w-full px-3 py-2.5 text-left text-neutral-500 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors">
						Logout
					</button>
				</form>

			</aside>
		{/if}

		<!-- ── Mobile bar ── -->
		{#if user}
			<div class="md:hidden fixed top-0 left-0 right-0 h-12 bg-black border-b border-neutral-800 flex items-center justify-between px-4 z-50">
				<span class="font-black" style="font-family:'Georgia',serif">momento</span>

				<div class="flex gap-4 text-sm">
					<a href="/" class="{active('/') ? 'text-white' : 'text-neutral-400'}">Home</a>
					<a href="/search" class="{active('/search') ? 'text-white' : 'text-neutral-400'}">Suche</a>
					<a href="/upload" class="{active('/upload') ? 'text-white' : 'text-neutral-400'}">Upload</a>
					<a href="/saved" class="{active('/saved') ? 'text-white' : 'text-neutral-400'}">Saved</a>
					<a href={`/profile/${user.username}`} class="{$page.url.pathname === `/profile/${user.username}` ? 'text-white' : 'text-neutral-400'}">Profil</a>
				</div>
			</div>
		{/if}

		<!-- ── Page content ── -->
		<main class="flex-1 {user ? 'pt-12 md:pt-0' : ''}">
			{@render children()}
		</main>

	</div>

	<!-- ── Footer ── -->
	<footer class="border-t border-neutral-800 px-6 py-6 text-center shrink-0">
		<p class="text-xs text-neutral-600">© {new Date().getFullYear()} Momento. All rights reserved.</p>
		<div class="flex justify-center gap-4 mt-2">
			<a href="/privacy" class="text-xs text-neutral-700 hover:text-neutral-400 transition-colors">Privacy Policy</a>
			<a href="/terms" class="text-xs text-neutral-700 hover:text-neutral-400 transition-colors">Terms of Service</a>
		</div>
	</footer>

</div>

		
