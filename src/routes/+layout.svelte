<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { data, children } = $props();

	const user = data?.user;

	const active = (path) => $page.url.pathname === path;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-black text-white flex">

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

				<a href="/upload"
					class="px-3 py-2.5 rounded-xl {active('/upload') ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
					Hochladen
				</a>

				<a href={`/profile/${user.username}`}
					class="px-3 py-2.5 rounded-xl {$page.url.pathname === `/profile/${user.username}` ? 'bg-neutral-800 font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}">
					Profil
				</a>

				{#if user.role === 'admin'}
					<a href="/admin" class="px-3 py-2.5 text-amber-400">
						Admin
					</a>
				{/if}

			</nav>

			<form method="POST" action="/logout">
				<button class="w-full px-3 py-2.5 text-neutral-500 hover:text-white">
					Logout
				</button>
			</form>

		</aside>
	{/if}

	<!-- ── Mobile bar ── -->
	{#if user}
		<div class="md:hidden fixed top-0 left-0 right-0 h-12 bg-black border-b border-neutral-800 flex items-center justify-between px-4 z-50">
			<span class="font-black" style="font-family:'Georgia',serif">momento</span>

			<div class="flex gap-4">
				<a href="/">Home</a>
				<a href="/upload">Upload</a>
				<a href={`/profile/${user.username}`}>Profil</a>
			</div>
		</div>
	{/if}

	<!-- ── Page content ── -->
	<main class="flex-1 {user ? 'pt-12 md:pt-0' : ''}">
		{@render children()}
	</main>

</div>