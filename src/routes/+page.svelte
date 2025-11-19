<script lang="ts">
	interface Props {
		data: {
			user: { nickname: string; accountId: string } | null;
		};
	}
	
	let { data }: Props = $props();
	let selectedRegion = $state('com');
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-12">
	<div class="max-w-4xl w-full bg-gradient-to-br from-[#1a2942] to-[#2a3952] rounded-lg border-4 border-[#d4af37] shadow-2xl p-8 md:p-12">
		<div class="text-center">
			<!-- Logo/Icon -->
			<div class="text-7xl mb-6">⚓</div>
			
			<!-- Title -->
			<h1 class="text-5xl md:text-6xl font-black text-[#d4af37] mb-4 uppercase tracking-wider" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
				WoWS Ship Randomizer
			</h1>
			
			<p class="text-xl text-[#7a8b99] mb-12 font-medium">
				Can't decide which ship to play? Let fate decide for you!
			</p>
			
			<!-- Features -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
				<div class="p-6 bg-[#0a1929] rounded-lg border-2 border-[#2a3952] hover:border-[#d4af37] transition-all">
					<div class="text-4xl mb-3">🚢</div>
					<h3 class="font-bold text-[#d4af37] mb-2 uppercase tracking-wide">Your Fleet</h3>
					<p class="text-sm text-[#7a8b99]">View all ships in your port</p>
				</div>
				<div class="p-6 bg-[#0a1929] rounded-lg border-2 border-[#2a3952] hover:border-[#d4af37] transition-all">
					<div class="text-4xl mb-3">🎯</div>
					<h3 class="font-bold text-[#d4af37] mb-2 uppercase tracking-wide">Filter</h3>
					<p class="text-sm text-[#7a8b99]">By nation, tier, and type</p>
				</div>
				<div class="p-6 bg-[#0a1929] rounded-lg border-2 border-[#2a3952] hover:border-[#d4af37] transition-all">
					<div class="text-4xl mb-3">🎲</div>
					<h3 class="font-bold text-[#d4af37] mb-2 uppercase tracking-wide">Randomize</h3>
					<p class="text-sm text-[#7a8b99]">Roll the dice and deploy!</p>
				</div>
			</div>
			
			<!-- Auth Section -->
			{#if data.user}
				<div class="space-y-6">
					<p class="text-[#7a8b99] text-xl">
						Welcome back, <span class="font-bold text-[#d4af37]">{data.user.nickname}</span>!
					</p>
					<div class="flex gap-4 justify-center flex-wrap">
						<a
							href="/ships"
							class="px-10 py-4 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-[#0a1929] font-black text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-[#0a1929] uppercase tracking-wider"
							style="text-shadow: 1px 1px 2px rgba(255,255,255,0.3);"
						>
							View My Fleet
						</a>
						<a
							href="/auth/logout"
							data-sveltekit-reload
							class="px-10 py-4 bg-[#2a3952] text-[#7a8b99] font-bold text-lg rounded-lg hover:bg-[#1a2942] hover:text-[#d4af37] transition-all border-2 border-[#7a8b99] uppercase tracking-wide"
						>
							Logout
						</a>
					</div>
				</div>
			{:else}
				<form method="POST" action="/auth/login" class="space-y-6">
					<!-- Region Selection -->
					<div class="max-w-md mx-auto">
						<label for="region" class="block text-[#d4af37] font-bold mb-3 uppercase tracking-wide text-lg">
							Select Your Region
						</label>
						<select
							id="region"
							name="region"
							bind:value={selectedRegion}
							class="w-full px-4 py-3 bg-[#1a2942] text-white border-2 border-[#2a3952] rounded-lg focus:border-[#d4af37] focus:outline-none font-medium text-lg"
						>
							<option value="com">North America</option>
							<option value="eu">Europe</option>
							<option value="asia">Asia</option>
							<option value="ru">Russia/CIS</option>
						</select>
					</div>
					
					<button
						type="submit"
						class="px-12 py-4 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-[#0a1929] font-black text-xl rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-[#0a1929] uppercase tracking-wider"
						style="text-shadow: 1px 1px 2px rgba(255,255,255,0.3);"
					>
						Sign in with Wargaming.net
					</button>
				</form>
			{/if}
			
			<!-- Footer Note -->
			<div class="mt-12 pt-8 border-t-2 border-[#2a3952]">
				<p class="text-sm text-[#7a8b99]">
					This is a fan-made tool and is not affiliated with Wargaming.net
				</p>
			</div>
		</div>
	</div>
</div>
