<script lang="ts">
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		ship: WargamingShip;
		onClick?: () => void;
		highlighted?: boolean;
		onFilterByType?: (type: string) => void;
		onFilterByTier?: (tier: number) => void;
		onFilterByNation?: (nation: string) => void;
	}
	
	let { ship, onClick, highlighted = false, onFilterByType, onFilterByTier, onFilterByNation }: Props = $props();
	
	const typeColors: Record<string, string> = {
		'Destroyer': 'bg-[#c41e3a] text-white border-[#c41e3a]',
		'Cruiser': 'bg-[#1e4a7a] text-white border-[#1e4a7a]',
		'Battleship': 'bg-[#7a1f7a] text-white border-[#7a1f7a]',
		'AirCarrier': 'bg-[#2d5f7f] text-white border-[#2d5f7f]',
		'Submarine': 'bg-[#0a1929] text-[#7a8b99] border-[#7a8b99]'
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

<div
	class="block w-full text-left p-5 rounded-lg border-2 transition-all hover:shadow-2xl {highlighted
		? 'border-[#f4d03f] bg-gradient-to-br from-[#d4af37] to-[#f4d03f] shadow-2xl scale-105'
		: 'border-[#2a3952] bg-gradient-to-br from-[#1a2942] to-[#2a3952] hover:border-[#d4af37]'}"
>
	<div class="flex justify-between items-start mb-3">
		<h3 class="font-bold text-xl {highlighted ? 'text-[#0a1929]' : 'text-[#d4af37]'}">{ship.name}</h3>
		<div class="flex gap-2">
			{#if ship.is_premium}
				<span 
					class="px-2 py-1 text-xs font-bold rounded bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1929] shadow-md transition-all group hover:px-3"
					title="Premium Ship"
				>
					<span class="inline">⭐</span>
					<span class="hidden group-hover:inline ml-1">PREMIUM</span>
				</span>
			{/if}
			{#if ship.is_special}
				<span 
					class="px-2 py-1 text-xs font-bold rounded bg-gradient-to-r from-[#c41e3a] to-[#ff4444] text-white shadow-md transition-all group hover:px-3"
					title="Special Ship"
				>
					<span class="inline">✨</span>
					<span class="hidden group-hover:inline ml-1">SPECIAL</span>
				</span>
			{/if}
		</div>
	</div>
	
	<div class="flex gap-2 flex-wrap">
		<button
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				onFilterByType?.(ship.type);
			}}
			class="px-3 py-1.5 text-xs font-bold rounded border-2 transition-all hover:scale-105 {highlighted ? 'bg-[#0a1929] text-[#f4d03f] border-[#0a1929]' : typeColors[ship.type] || 'bg-[#2a3952] text-[#7a8b99] border-[#7a8b99]'}"
			title="Filter by ship type"
		>
			{typeDisplay}
		</button>
		<button
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				onFilterByTier?.(ship.tier);
			}}
			class="px-3 py-1.5 text-xs font-bold rounded border-2 transition-all hover:scale-105 {highlighted ? 'bg-[#0a1929] text-[#f4d03f] border-[#0a1929]' : 'bg-[#1a2942] text-[#d4af37] border-[#d4af37]'}"
			title="Filter by tier"
		>
			TIER {ship.tier}
		</button>
		<button
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				onFilterByNation?.(ship.nation);
			}}
			class="px-3 py-1.5 text-xs font-bold rounded border-2 transition-all hover:scale-105 {highlighted ? 'bg-[#0a1929] text-[#f4d03f] border-[#0a1929]' : 'bg-[#2a3952] text-[#7a8b99] border-[#7a8b99]'}"
			title="Filter by nation"
		>
			{nationNames[ship.nation] || ship.nation}
		</button>
	</div>
</div>
