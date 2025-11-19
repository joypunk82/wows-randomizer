<script lang="ts">
	interface Props {
		data: {
			user: { nickname: string; accountId: string } | null;
		};
	}
	
	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
	<div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
		<div class="text-center">
			<!-- Logo/Icon -->
			<div class="text-6xl mb-6">⚓️</div>
			
			<!-- Title -->
			<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
				WoWS Randomizer
			</h1>
			
			<p class="text-lg text-gray-600 mb-8">
				Can't decide which ship to play? Let fate decide for you!
			</p>
			
			<!-- Features -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<div class="p-4 bg-blue-50 rounded-lg">
					<div class="text-3xl mb-2">🚢</div>
					<h3 class="font-semibold text-gray-900 mb-1">Your Ships</h3>
					<p class="text-sm text-gray-600">View all ships in your port</p>
				</div>
				<div class="p-4 bg-purple-50 rounded-lg">
					<div class="text-3xl mb-2">🎯</div>
					<h3 class="font-semibold text-gray-900 mb-1">Filter</h3>
					<p class="text-sm text-gray-600">By nation, tier, and type</p>
				</div>
				<div class="p-4 bg-indigo-50 rounded-lg">
					<div class="text-3xl mb-2">🎲</div>
					<h3 class="font-semibold text-gray-900 mb-1">Randomize</h3>
					<p class="text-sm text-gray-600">Roll the dice!</p>
				</div>
			</div>
			
			<!-- Auth Section -->
			{#if data.user}
				<div class="space-y-4">
					<p class="text-gray-700">
						Welcome back, <span class="font-bold">{data.user.nickname}</span>!
					</p>
					<div class="flex gap-4 justify-center">
						<a
							href="/ships"
							class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
						>
							View My Ships
						</a>
						<a
							href="/auth/logout"
							class="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
						>
							Logout
						</a>
					</div>
				</div>
			{:else}
				<a
					href="/auth/login"
					class="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
				>
					Sign in with Wargaming.net
				</a>
			{/if}
			
			<!-- Footer Note -->
			<p class="mt-8 text-sm text-gray-500">
				This is a fan-made tool and is not affiliated with Wargaming.net
			</p>
		</div>
	</div>
</div>
