<script lang="ts">
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		ship: WargamingShip;
		onClick?: () => void;
		highlighted?: boolean;
	}
	
	let { ship, onClick, highlighted = false }: Props = $props();
	
	const typeColors: Record<string, string> = {
		'Destroyer': 'bg-red-100 text-red-800',
		'Cruiser': 'bg-blue-100 text-blue-800',
		'Battleship': 'bg-purple-100 text-purple-800',
		'AirCarrier': 'bg-green-100 text-green-800',
		'Submarine': 'bg-gray-100 text-gray-800'
	};
	
	const nationNames: Record<string, string> = {
		'usa': 'USA',
		'japan': 'Japan',
		'ussr': 'USSR',
		'germany': 'Germany',
		'uk': 'UK',
		'france': 'France',
		'pan_asia': 'Pan-Asia',
		'italy': 'Italy',
		'commonwealth': 'Commonwealth',
		'pan_america': 'Pan-America',
		'europe': 'Europe',
		'netherlands': 'Netherlands',
		'spain': 'Spain'
	};
	
	const typeDisplay = ship.type.replace('AirCarrier', 'Aircraft Carrier');
</script>

<button
	onclick={onClick}
	class="block w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-lg {highlighted
		? 'border-yellow-400 bg-yellow-50 shadow-xl'
		: 'border-gray-200 bg-white hover:border-gray-300'}"
>
	<div class="flex justify-between items-start mb-2">
		<h3 class="font-bold text-lg text-gray-900">{ship.name}</h3>
		<div class="flex gap-2">
			{#if ship.is_premium}
				<span class="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
					Premium
				</span>
			{/if}
			{#if ship.is_special}
				<span class="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
					Special
				</span>
			{/if}
		</div>
	</div>
	
	<div class="flex gap-2 flex-wrap">
		<span class="px-2 py-1 text-xs font-semibold rounded {typeColors[ship.type] || 'bg-gray-100 text-gray-800'}">
			{typeDisplay}
		</span>
		<span class="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
			Tier {ship.tier}
		</span>
		<span class="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
			{nationNames[ship.nation] || ship.nation}
		</span>
	</div>
</button>
