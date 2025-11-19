<script lang="ts">
	import './layout.css';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>WoWS Randomizer - Random Ship Selector</title>
	<meta name="description" content="Can't decide which ship to play in World of Warships? Let fate decide with WoWS Randomizer!" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</svelte:head>

<div class="min-h-screen">
	<!-- Naval Header -->
	<header class="bg-gradient-to-r from-[#0a1929] via-[#1e4a7a] to-[#0a1929] border-b-4 border-[#d4af37] shadow-2xl">
		<div class="max-w-7xl mx-auto px-4 py-6">
			<div class="flex items-center gap-4">
				<div class="text-5xl">⚓</div>
				<div>
					<h1 class="text-3xl font-bold text-[#d4af37] tracking-wider uppercase" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
						WoWS Ship Randomizer
					</h1>
					<p class="text-[#7a8b99] text-sm">Set Sail with Fate</p>
				</div>
			</div>
		</div>
	</header>
	
	{@render children()}
	
	<!-- Naval Footer -->
	<footer class="bg-[#0a1929] border-t-2 border-[#d4af37] mt-12 py-6">
		<div class="max-w-7xl mx-auto px-4 text-center text-[#7a8b99] text-sm">
			<p>⚓ Fair winds and following seas, Captain! ⚓</p>
		</div>
	</footer>
</div>
