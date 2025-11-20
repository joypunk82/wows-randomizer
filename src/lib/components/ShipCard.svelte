<script lang="ts">
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		ship: WargamingShip;
		onClick?: () => void;
		highlighted?: boolean;
		onFilterByType?: (type: string) => void;
		onFilterByTier?: (tier: number) => void;
		onFilterByNation?: (nation: string) => void;
		onViewStats?: (ship: WargamingShip) => void;
	}
	
	let { ship, onClick, highlighted = false, onFilterByType, onFilterByTier, onFilterByNation, onViewStats }: Props = $props();
	
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
	
	// Calculate stats for display
	const winRate = ship.battles && ship.wins ? ((ship.wins / ship.battles) * 100).toFixed(1) : null;
	const avgDamage = ship.battles && ship.damage_dealt ? Math.round(ship.damage_dealt / ship.battles) : null;
	const survivalRate = ship.battles && ship.survived_battles ? ((ship.survived_battles / ship.battles) * 100).toFixed(1) : null;
	const avgXp = ship.battles && ship.xp ? Math.round(ship.xp / ship.battles) : null;
	const avgFrags = ship.battles && ship.frags ? (ship.frags / ship.battles).toFixed(2) : null;
	const lastBattle = ship.last_battle_time ? new Date(ship.last_battle_time * 1000).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	}) : null;
</script>

<div
	class="block w-full text-left p-5 rounded-lg border-2 transition-all hover:shadow-2xl {highlighted
		? 'border-[#f4d03f] bg-gradient-to-br from-[#d4af37] to-[#f4d03f] shadow-2xl scale-105'
		: 'border-[#2a3952] bg-gradient-to-br from-[#1a2942] to-[#2a3952] hover:border-[#d4af37]'}"
>
	<div class="flex justify-between items-start mb-3">
		<button
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				onViewStats?.(ship);
			}}
			class="font-bold text-xl text-left hover:underline transition-all {highlighted ? 'text-[#0a1929] hover:text-[#1a2942]' : 'text-[#d4af37] hover:text-[#f4d03f]'}"
			title="Click to view battle statistics"
		>
			{ship.name}
		</button>
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
	
	{#if highlighted && ship.battles}
		<div class="mt-4 pt-4 border-t border-[#0a1929]/30">
			<div class="grid grid-cols-3 gap-4 text-sm">
				<div class="text-[#0a1929]">
					<div class="font-semibold text-[#0a1929]">⚔️ BATTLES</div>
					<div class="text-lg font-bold">{ship.battles.toLocaleString()}</div>
				</div>
				{#if winRate}
					<div class="text-[#0a1929]">
						<div class="font-semibold text-[#0a1929]">🏆 WIN RATE</div>
						<div class="text-lg font-bold">{winRate}%</div>
					</div>
				{/if}
				{#if avgDamage}
					<div class="text-[#0a1929]">
						<div class="font-semibold text-[#0a1929]">💥 AVG DAMAGE</div>
						<div class="text-lg font-bold">{avgDamage.toLocaleString()}</div>
					</div>
				{/if}
				{#if avgXp}
					<div class="text-[#0a1929]">
						<div class="font-semibold text-[#0a1929]">⭐ AVG XP</div>
						<div class="text-lg font-bold">{avgXp.toLocaleString()}</div>
					</div>
				{/if}
				{#if avgFrags}
					<div class="text-[#0a1929]">
						<div class="font-semibold text-[#0a1929]">💀 AVG KILLS</div>
						<div class="text-lg font-bold">{avgFrags}</div>
					</div>
				{/if}
				{#if survivalRate}
					<div class="text-[#0a1929]">
						<div class="font-semibold text-[#0a1929]">🛡️ SURVIVAL</div>
						<div class="text-lg font-bold">{survivalRate}%</div>
					</div>
				{/if}
			</div>
			{#if lastBattle}
				<div class="mt-3 pt-3 border-t border-[#0a1929]/20 text-center text-[#0a1929]/70 text-xs">
					Last Battle: <span class="font-semibold">{lastBattle}</span>
				</div>
			{/if}
		</div>
	{/if}
</div>
