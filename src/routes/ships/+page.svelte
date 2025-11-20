<script lang="ts">
	import ShipCard from '$lib/components/ShipCard.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import DiceButton from '$lib/components/DiceButton.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import { parseSearchQuery } from '$lib/utils/searchParser';
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		data: {
			ships: WargamingShip[];
			nations: string[];
			tiers: number[];
			types: string[];
			user: {
				nickname: string;
				accountId: string;
			};
		};
	}
	
	let { data }: Props = $props();
	
	// Sidebar state
	let sidebarOpen = $state(false);
	
	// Filter state - using Sets to store multiple selections
	let selectedNations = $state<Set<string>>(new Set(data.nations));
	let selectedTiers = $state<Set<string>>(new Set(data.tiers.map(t => t.toString())));
	let selectedTypes = $state<Set<string>>(new Set(data.types));
	
	// Search state
	let searchQuery = $state('');
	let searchShipName = $state('');
	
	// Random ship state
	let selectedShip = $state<WargamingShip | null>(null);
	let isRolling = $state(false);
	
	// Filtered ships
	const filteredShips = $derived(() => {
		return data.ships.filter(ship => {
			// Filter by checkboxes
			if (selectedNations.size > 0 && !selectedNations.has(ship.nation)) return false;
			if (selectedTiers.size > 0 && !selectedTiers.has(ship.tier.toString())) return false;
			if (selectedTypes.size > 0 && !selectedTypes.has(ship.type)) return false;
			
			// Filter by ship name search
			if (searchShipName && !ship.name.toLowerCase().includes(searchShipName.toLowerCase())) {
				return false;
			}
			
			return true;
		});
	});
	
	// Handle search query changes
	function handleSearchChange(query: string) {
		searchQuery = query;
		const parsed = parseSearchQuery(query);
		
		// If filters were detected, apply them
		if (parsed.tiers.length > 0) {
			selectedTiers = new Set(parsed.tiers);
		}
		if (parsed.types.length > 0) {
			selectedTypes = new Set(parsed.types);
		}
		if (parsed.nations.length > 0) {
			selectedNations = new Set(parsed.nations);
		}
		
		// Always update ship name filter
		searchShipName = parsed.shipName;
		
		// Clear selected ship when search changes
		selectedShip = null;
	}
	
	// Nation names and flags for display
	const nationData: Record<string, { label: string; flag: string }> = {
		'japan': { label: 'Japan', flag: '🇯🇵' },
		'usa': { label: 'USA', flag: '🇺🇸' },
		'ussr': { label: 'U.S.S.R.', flag: '🚩' },
		'germany': { label: 'Germany', flag: '🇩🇪' },
		'uk': { label: 'U.K.', flag: '🇬🇧' },
		'france': { label: 'France', flag: '🇫🇷' },
		'pan_asia': { label: 'Pan-Asia', flag: '🌏' },
		'italy': { label: 'Italy', flag: '🇮🇹' },
		'commonwealth': { label: 'Commonwealth', flag: '🏴' },
		'pan_america': { label: 'Pan-America', flag: '🌎' },
		'europe': { label: 'Europe', flag: '🇪🇺' },
		'netherlands': { label: 'Netherlands', flag: '🇳🇱' },
		'spain': { label: 'Spain', flag: '🇪🇸' },
		'portugal': { label: 'Portugal', flag: '🇵🇹' }
	};
	
	// Type icons and labels
	const typeData: Record<string, { label: string; icon: string }> = {
		'Destroyer': { label: 'Destroyer', icon: '🚢' },
		'Cruiser': { label: 'Cruiser', icon: '⚓' },
		'Battleship': { label: 'Battleship', icon: '🛡️' },
		'AirCarrier': { label: 'Aircraft Carrier', icon: '✈️' },
		'Submarine': { label: 'Submarine', icon: '🔱' }
	};
	
	// Nation names for display (legacy, keep for compatibility)
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
	
	// Quick filter functions
	function filterByType(type: string) {
		selectedTypes = new Set([type]);
		selectedShip = null;
		sidebarOpen = true; // Open sidebar to show the applied filter
	}
	
	function filterByTier(tier: number) {
		selectedTiers = new Set([tier.toString()]);
		selectedShip = null;
		sidebarOpen = true;
	}
	
	function filterByNation(nation: string) {
		selectedNations = new Set([nation]);
		selectedShip = null;
		sidebarOpen = true;
	}
	
	// Reset all filters to default (everything selected)
	function resetAllFilters() {
		selectedNations = new Set(data.nations);
		selectedTiers = new Set(data.tiers.map(t => t.toString()));
		selectedTypes = new Set(data.types);
		searchQuery = '';
		searchShipName = '';
		selectedShip = null;
	}
</script>

<div class="min-h-screen">
	<!-- Collapsible Sidebar -->
	<aside 
		class="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-br from-[#1a2942] to-[#2a3952] border-r-4 border-[#d4af37] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
		aria-label="Filter sidebar"
	>
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
			
			<!-- Reset All Button -->
			<button
				onclick={resetAllFilters}
				class="w-full px-4 py-3 mb-4 bg-[#2a3952] hover:bg-[#1a2942] text-[#d4af37] hover:text-[#f4d03f] font-bold rounded-lg border-2 border-[#7a8b99] hover:border-[#d4af37] transition-all uppercase tracking-wide text-sm"
			>
				Reset All Filters
			</button>
			
			<!-- Search Box -->
			<div class="mb-6">
				<SearchBox 
					bind:value={searchQuery}
					onchange={handleSearchChange}
					placeholder="Search ships or use filters..."
				/>
				{#if searchQuery}
					<div class="mt-2 text-xs text-[#7a8b99] px-1">
						{#if searchShipName}
							<span class="text-[#aabaca]">Searching for:</span> <span class="text-[#d4af37]">{searchShipName}</span>
						{/if}
					</div>
				{/if}
			</div>
			
			<!-- Filters -->
			<div class="space-y-6">
				<FilterSelect
					label="Tier"
					selectedValues={selectedTiers}
					onchange={(vals) => { selectedTiers = vals; selectedShip = null; }}
					options={data.tiers.map(t => ({ 
						value: t.toString(), 
						label: t === 11 ? '★' : (t < 10 ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][t - 1] : 'X'),
						icon: t === 11 ? '⭐' : undefined
					}))}
				/>
				
				<FilterSelect
					label="Type"
					selectedValues={selectedTypes}
					onchange={(vals) => { selectedTypes = vals; selectedShip = null; }}
					options={data.types.map(t => ({ 
						value: t, 
						label: typeData[t]?.label || t,
						icon: typeData[t]?.icon
					}))}
				/>
				
				<FilterSelect
					label="Nation"
					selectedValues={selectedNations}
					onchange={(vals) => { selectedNations = vals; selectedShip = null; }}
					options={data.nations.map(n => ({ 
						value: n, 
						label: nationData[n]?.label || n,
						icon: nationData[n]?.flag
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
	</aside>
	
	<!-- Overlay to close sidebar when clicking outside -->
	{#if sidebarOpen}
		<button 
			class="fixed inset-0 z-40 cursor-default bg-transparent"
			onclick={() => sidebarOpen = false}
			aria-label="Close sidebar"
			tabindex="-1"
		></button>
	{/if}
	
	<div class="max-w-7xl mx-auto px-4 py-8">
		<!-- Top Navigation Bar -->
		<div class="flex items-center justify-between mb-8">
			<!-- Filters Button - Left -->
			<button
				onclick={() => sidebarOpen = !sidebarOpen}
				class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1a2942] to-[#2a3952] border-2 border-[#d4af37] rounded-lg hover:border-[#f4d03f] transition-all shadow-lg hover:shadow-xl"
			>
				<span class="text-[#d4af37] text-lg">☰</span>
				<span class="text-[#d4af37] font-bold uppercase tracking-wide text-sm">Filters</span>
				<span class="text-[#7a8b99] text-xs">({filteredShips().length})</span>
			</button>
			
			<!-- User Profile - Right -->
			<div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1a2942] to-[#2a3952] border-2 border-[#2a3952] rounded-lg">
				<span class="text-[#7a8b99] text-xs">Captain:</span>
				<span class="text-[#d4af37] font-bold text-sm">{data.user.nickname}</span>
				<a
					href="/auth/logout"
					data-sveltekit-reload
					class="ml-2 px-2 py-1 bg-[#c41e3a] hover:bg-[#ff4444] text-white text-xs font-bold rounded transition-all uppercase tracking-wide"
				>
					Logout
				</a>
			</div>
		</div>
		
		<!-- Hero Section with Title and Deploy Button -->
		<div class="text-center mb-8">
			<h2 class="text-4xl font-bold text-[#d4af37] mb-2 tracking-wide uppercase" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
				Port: Your Fleet
			</h2>
			<p class="text-[#7a8b99] text-lg mb-6">Select your vessel and set sail, Captain!</p>
			
			<!-- Large Centered Deploy Button -->
			<div class="flex justify-center">
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
							onFilterByType={filterByType}
							onFilterByTier={filterByTier}
							onFilterByNation={filterByNation}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
