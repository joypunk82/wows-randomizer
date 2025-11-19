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
	
	// Filter state
	let selectedNation = $state('all');
	let selectedTier = $state('all');
	let selectedType = $state('all');
	
	// Random ship state
	let selectedShip = $state<WargamingShip | null>(null);
	let isRolling = $state(false);
	
	// Filtered ships
	const filteredShips = $derived(() => {
		return data.ships.filter(ship => {
			if (selectedNation !== 'all' && ship.nation !== selectedNation) return false;
			if (selectedTier !== 'all' && ship.tier !== parseInt(selectedTier)) return false;
			if (selectedType !== 'all' && ship.type !== selectedType) return false;
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

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Your Ships</h1>
			<p class="text-gray-600">Filter your ships and roll the dice to select one randomly!</p>
		</div>
		
		<!-- Filters -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-bold text-gray-900 mb-4">Filters</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<FilterSelect
					label="Nation"
					value={selectedNation}
					onchange={(val) => { selectedNation = val; selectedShip = null; }}
					options={[
						{ value: 'all', label: 'All Nations' },
						...data.nations.map(n => ({ 
							value: n, 
							label: nationNames[n] || n 
						}))
					]}
				/>
				
				<FilterSelect
					label="Tier"
					value={selectedTier}
					onchange={(val) => { selectedTier = val; selectedShip = null; }}
					options={[
						{ value: 'all', label: 'All Tiers' },
						...data.tiers.map(t => ({ 
							value: t.toString(), 
							label: `Tier ${t}` 
						}))
					]}
				/>
				
				<FilterSelect
					label="Type"
					value={selectedType}
					onchange={(val) => { selectedType = val; selectedShip = null; }}
					options={[
						{ value: 'all', label: 'All Types' },
						...data.types.map(t => ({ 
							value: t, 
							label: formatType(t)
						}))
					]}
				/>
			</div>
			
			<div class="mt-6 flex items-center justify-between">
				<p class="text-gray-600">
					Showing <span class="font-bold">{filteredShips().length}</span> of <span class="font-bold">{data.ships.length}</span> ships
				</p>
				
				<DiceButton
					onclick={rollDice}
					disabled={filteredShips().length === 0 || isRolling}
					rolling={isRolling}
				/>
			</div>
		</div>
		
		<!-- Selected Ship -->
		{#if selectedShip}
			<div class="mb-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">🎉 Your Random Ship!</h2>
				<ShipCard ship={selectedShip} highlighted={true} />
			</div>
		{/if}
		
		<!-- Ships Grid -->
		<div>
			<h2 class="text-2xl font-bold text-gray-900 mb-4">All Ships</h2>
			{#if filteredShips().length === 0}
				<div class="bg-white rounded-lg shadow-md p-12 text-center">
					<p class="text-gray-600 text-lg">No ships match your filters. Try adjusting them!</p>
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
