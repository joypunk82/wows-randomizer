<script lang="ts">
	import ShipCard from '$lib/components/ShipCard.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import DiceButton from '$lib/components/DiceButton.svelte';
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		data: {
			ships: WargamingShip[];
			nations: string[];
			tiers: number[];
			types: string[];
		};
	}
	
	let { data }: Props = $props();
	
	// Sidebar state
	let sidebarOpen = $state(false);
	
	// Filter state - using Sets to store multiple selections
	let selectedNations = $state<Set<string>>(new Set(data.nations));
	let selectedTiers = $state<Set<string>>(new Set(data.tiers.map(t => t.toString())));
	let selectedTypes = $state<Set<string>>(new Set(data.types));
	
	// Random ship state
	let selectedShip = $state<WargamingShip | null>(null);
	let isRolling = $state(false);
	
	// Filtered ships
	const filteredShips = $derived(() => {
		return data.ships.filter(ship => {
			if (selectedNations.size > 0 && !selectedNations.has(ship.nation)) return false;
			if (selectedTiers.size > 0 && !selectedTiers.has(ship.tier.toString())) return false;
			if (selectedTypes.size > 0 && !selectedTypes.has(ship.type)) return false;
			return true;
		});
	});
	
	// Nation names for display
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
	
	// Roll dice function
	function rollDice() {
		const ships = filteredShips();
		
		if (ships.length === 0) return;
		
		isRolling = true;
		selectedShip = null;
		
		// Simulate rolling animation
		let rollCount = 0;
		const rollInterval = setInterval(() => {
			selectedShip = ships[Math.floor(Math.random() * ships.length)];
			rollCount++;
			
			if (rollCount >= 10) {
				clearInterval(rollInterval);
				isRolling = false;
			}
		}, 100);
	}
	
	// Type display helper
	function formatType(type: string): string {
		return type.replace('AirCarrier', 'Aircraft Carrier');
	}
</script>

<div class="min-h-screen">
	<!-- Collapsible Sidebar -->
	<div class="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-br from-[#1a2942] to-[#2a3952] border-r-4 border-[#d4af37] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
		<div class="p-6">
			<!-- Sidebar Header -->
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-2xl font-bold text-[#d4af37] uppercase tracking-wide">Battle Parameters</h3>
				<button
					onclick={() => sidebarOpen = false}
					class="text-[#7a8b99] hover:text-[#d4af37] transition-colors text-2xl"
					aria-label="Close sidebar"
				>
					✕
				</button>
			</div>
			
			<!-- Filters -->
			<div class="space-y-6">
				<FilterSelect
					label="Nation"
					selectedValues={selectedNations}
					onchange={(vals) => { selectedNations = vals; selectedShip = null; }}
					options={data.nations.map(n => ({ 
						value: n, 
						label: nationNames[n] || n 
					}))}
				/>
				
				<FilterSelect
					label="Tier"
					selectedValues={selectedTiers}
					onchange={(vals) => { selectedTiers = vals; selectedShip = null; }}
					options={data.tiers.map(t => ({ 
						value: t.toString(), 
						label: `Tier ${t}` 
					}))}
				/>
				
				<FilterSelect
					label="Type"
					selectedValues={selectedTypes}
					onchange={(vals) => { selectedTypes = vals; selectedShip = null; }}
					options={data.types.map(t => ({ 
						value: t, 
						label: formatType(t)
					}))}
				/>
			</div>
			
			<!-- Ship Count in Sidebar -->
			<div class="mt-8 pt-6 border-t-2 border-[#d4af37]">
				<div class="text-[#7a8b99] text-center">
					<div class="text-[#d4af37] font-bold text-3xl">{filteredShips().length}</div>
					<div class="text-sm mt-1">ships available</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="max-w-7xl mx-auto px-4 py-8">
		<!-- Page Header with Filter Toggle -->
		<div class="mb-6">
			<div class="flex items-center justify-between mb-4">
				<button
					onclick={() => sidebarOpen = !sidebarOpen}
					class="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#1a2942] to-[#2a3952] border-2 border-[#d4af37] rounded-lg hover:border-[#f4d03f] transition-all shadow-lg hover:shadow-xl"
				>
					<span class="text-[#d4af37] text-xl">☰</span>
					<span class="text-[#d4af37] font-bold uppercase tracking-wide">Filters</span>
					<span class="text-[#7a8b99] text-sm">({filteredShips().length} ships)</span>
				</button>
				
				<DiceButton
					onclick={rollDice}
					disabled={filteredShips().length === 0 || isRolling}
					rolling={isRolling}
				/>
			</div>
			
			<div class="text-center">
				<h2 class="text-4xl font-bold text-[#d4af37] mb-2 tracking-wide uppercase" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
					Port: Your Fleet
				</h2>
				<p class="text-[#7a8b99] text-lg">Select your vessel and set sail, Captain!</p>
			</div>
		</div>
		
		<!-- Selected Ship -->
		{#if selectedShip}
			<div class="mb-8">
				<div class="text-center mb-4">
					<h3 class="text-3xl font-bold text-[#f4d03f] mb-2" style="text-shadow: 2px 2px 8px rgba(212,175,55,0.8);">
						Your Mission Awaits
					</h3>
					<p class="text-[#7a8b99] text-lg">Deploy this vessel, Captain!</p>
				</div>
				<ShipCard ship={selectedShip} highlighted={true} />
			</div>
		{/if}
		
		<!-- Ships Grid -->
		<div>
			{#if filteredShips().length === 0}
				<div class="bg-gradient-to-br from-[#1a2942] to-[#2a3952] rounded-lg border-2 border-[#c41e3a] shadow-xl p-12 text-center">
					<p class="text-[#7a8b99] text-xl mb-2">No ships match your battle parameters</p>
					<p class="text-[#7a8b99]">Adjust your filters to see available vessels</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each filteredShips() as ship (ship.ship_id)}
						<ShipCard 
							ship={ship} 
							highlighted={selectedShip?.ship_id === ship.ship_id}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
