<script lang="ts">
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		ship: WargamingShip;
		onClick?: () => void;
		highlighted?: boolean;
	}
	
	let { ship, onClick, highlighted = false }: Props = $props();
	
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

<button
	onclick={onClick}
	class="block w-full text-left p-5 rounded-lg border-2 transition-all hover:shadow-2xl {highlighted
		? 'border-[#f4d03f] bg-gradient-to-br from-[#d4af37] to-[#f4d03f] shadow-2xl scale-105'
		: 'border-[#2a3952] bg-gradient-to-br from-[#1a2942] to-[#2a3952] hover:border-[#d4af37]'}"
>
	<div class="flex justify-between items-start mb-3">
		<h3 class="font-bold text-xl {highlighted ? 'text-[#0a1929]' : 'text-[#d4af37]'}">{ship.name}</h3>
		<div class="flex gap-2">
			{#if ship.is_premium}
				<span class="px-2 py-1 text-xs font-bold rounded bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a1929] shadow-md">
					⭐ PREMIUM
				</span>
			{/if}
			{#if ship.is_special}
				<span class="px-2 py-1 text-xs font-bold rounded bg-gradient-to-r from-[#c41e3a] to-[#ff4444] text-white shadow-md">
					✨ SPECIAL
				</span>
			{/if}
		</div>
	</div>
	
	<div class="flex gap-2 flex-wrap">
		<span class="px-3 py-1.5 text-xs font-bold rounded border-2 {highlighted ? 'bg-[#0a1929] text-[#f4d03f] border-[#0a1929]' : typeColors[ship.type] || 'bg-[#2a3952] text-[#7a8b99] border-[#7a8b99]'}">
			{typeDisplay}
		</span>
		<span class="px-3 py-1.5 text-xs font-bold rounded border-2 {highlighted ? 'bg-[#0a1929] text-[#f4d03f] border-[#0a1929]' : 'bg-[#1a2942] text-[#d4af37] border-[#d4af37]'}">
			TIER {ship.tier}
		</span>
		<span class="px-3 py-1.5 text-xs font-bold rounded border-2 {highlighted ? 'bg-[#0a1929] text-[#f4d03f] border-[#0a1929]' : 'bg-[#2a3952] text-[#7a8b99] border-[#7a8b99]'}">
			{nationNames[ship.nation] || ship.nation}
		</span>
	</div>
</button>
