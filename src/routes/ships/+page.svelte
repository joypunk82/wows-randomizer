<script lang="ts">
	import ShipCard from '$lib/components/ShipCard.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import DiceButton from '$lib/components/DiceButton.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import ShipStatsModal from '$lib/components/ShipStatsModal.svelte';
	import { parseSearchQuery } from '$lib/utils/searchParser';
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		data: {
			ships: WargamingShip[];
			nations: string[];
			tiers: number[];
			types: string[];
			favorites: number[];
			blacklist: number[];
			user: {
				nickname: string;
				accountId: string;
			};
		};
	}
	
	let { data }: Props = $props();
	
	// Preferences state
	let favorites = $state<Set<number>>(new Set(data.favorites));
	let blacklist = $state<Set<number>>(new Set(data.blacklist));
	let showFavoritesOnly = $state(false);
	
	// Sidebar state
	let sidebarOpen = $state(false);
	
	// Filter state - using Sets to store multiple selections
	let selectedNations = $state<Set<string>>(new Set(data.nations));
	let selectedTiers = $state<Set<string>>(new Set(data.tiers.map(t => t.toString())));
	let selectedTypes = $state<Set<string>>(new Set(data.types));
	let selectedCategories = $state<Set<string>>(new Set(['tech_tree', 'premium', 'special']));
	
	// Search state
	let searchQuery = $state('');
	let searchShipName = $state('');
	
	// Random ship state
	let selectedShip = $state<WargamingShip | null>(null);
	let isRolling = $state(false);
	
	// Modal state
	let statsModalShip = $state<WargamingShip | null>(null);
	
	// Filtered ships - separated into favorites, regular, and blacklisted
	const filteredShips = $derived(() => {
		const favs: WargamingShip[] = [];
		const regular: WargamingShip[] = [];
		const blacklisted: WargamingShip[] = [];
		
		data.ships.forEach(ship => {
			// Apply filters (except blacklist)
			// Filter by favorites only if enabled
			if (showFavoritesOnly && !favorites.has(ship.ship_id)) return;
			
			// Filter by checkboxes
			if (selectedNations.size > 0 && !selectedNations.has(ship.nation)) return;
			if (selectedTiers.size > 0 && !selectedTiers.has(ship.tier.toString())) return;
			if (selectedTypes.size > 0 && !selectedTypes.has(ship.type)) return;
			
			// Filter by category (premium/special/tech tree)
			if (selectedCategories.size > 0) {
				const shipCategory = ship.is_special ? 'special' : (ship.is_premium ? 'premium' : 'tech_tree');
				if (!selectedCategories.has(shipCategory)) return;
			}
			
			// Filter by ship name search
			if (searchShipName && !ship.name.toLowerCase().includes(searchShipName.toLowerCase())) {
				return;
			}
			
			// Separate into favorites, regular, and blacklisted
			if (blacklist.has(ship.ship_id)) {
				blacklisted.push(ship);
			} else if (favorites.has(ship.ship_id)) {
				favs.push(ship);
			} else {
				regular.push(ship);
			}
		});
		
		// Return favorites first, then regular ships, then blacklisted ships
		return [...favs, ...regular, ...blacklisted];
	});
	
	// Ships eligible for randomization (excludes blacklisted ships)
	const eligibleShips = $derived(() => {
		return filteredShips().filter(ship => !blacklist.has(ship.ship_id));
	});
	
	// Check if filters are in an invalid state (nothing selected)
	const hasInvalidFilters = $derived(() => {
		return selectedNations.size === 0 || 
		       selectedTiers.size === 0 || 
		       selectedTypes.size === 0 || 
		       selectedCategories.size === 0;
	});
	
	// Get specific reason why no ships are available
	const noShipsReason = $derived(() => {
		if (selectedNations.size === 0) return 'No nations selected. Please select at least one nation.';
		if (selectedTiers.size === 0) return 'No tiers selected. Please select at least one tier.';
		if (selectedTypes.size === 0) return 'No ship types selected. Please select at least one type.';
		if (selectedCategories.size === 0) return 'No categories selected. Please select at least one category.';
		if (filteredShips().length === 0) return 'No ships match your current filters.';
		if (eligibleShips().length === 0) return 'All filtered ships are blacklisted. Remove ships from the blacklist or adjust your filters.';
		return '';
	});
	
	// Handle search query changes
	function handleSearchChange(query: string) {
		searchQuery = query;
		
		// If search is cleared, reset all filters to defaults
		if (!query || query.trim() === '') {
			selectedNations = new Set(data.nations);
			selectedTiers = new Set(data.tiers.map(t => t.toString()));
			selectedTypes = new Set(data.types);
			selectedCategories = new Set(['tech_tree', 'premium', 'special']);
			searchShipName = '';
			selectedShip = null;
			return;
		}
		
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
		if (parsed.categories.length > 0) {
			selectedCategories = new Set(parsed.categories);
		}
		
		// Always update ship name filter
		searchShipName = parsed.shipName;
		
		// Clear selected ship when search changes
		selectedShip = null;
	}
	
	// Preference management functions
	async function saveFavorites() {
		try {
			await fetch('/api/preferences/favorites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ favorites: Array.from(favorites) })
			});
		} catch (error) {
			console.error('Failed to save favorites:', error);
		}
	}
	
	async function saveBlacklist() {
		try {
			await fetch('/api/preferences/blacklist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ blacklist: Array.from(blacklist) })
			});
		} catch (error) {
			console.error('Failed to save blacklist:', error);
		}
	}
	
	async function toggleFavorite(shipId: number) {
		if (favorites.has(shipId)) {
			favorites.delete(shipId);
			favorites = new Set(favorites); // Trigger reactivity
		} else {
			favorites.add(shipId);
			favorites = new Set(favorites); // Trigger reactivity
			// Remove from blacklist if it was there
			if (blacklist.has(shipId)) {
				blacklist.delete(shipId);
				blacklist = new Set(blacklist); // Trigger reactivity
				await saveBlacklist();
			}
		}
		await saveFavorites();
	}
	
	async function toggleBlacklist(shipId: number) {
		if (blacklist.has(shipId)) {
			blacklist.delete(shipId);
			blacklist = new Set(blacklist); // Trigger reactivity
		} else {
			blacklist.add(shipId);
			blacklist = new Set(blacklist); // Trigger reactivity
			// Remove from favorites if it was there
			if (favorites.has(shipId)) {
				favorites.delete(shipId);
				favorites = new Set(favorites); // Trigger reactivity
				await saveFavorites();
			}
		}
		await saveBlacklist();
	}
	
	async function clearFavorites() {
		if (confirm('Are you sure you want to clear all favorites?')) {
			favorites.clear();
			favorites = new Set(favorites); // Trigger reactivity
			await saveFavorites();
		}
	}
	
	async function clearBlacklist() {
		if (confirm('Are you sure you want to clear all blacklisted ships?')) {
			blacklist.clear();
			blacklist = new Set(blacklist); // Trigger reactivity
			await saveBlacklist();
		}
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
	
	// Category options
	const categoryOptions = [
		{ value: 'tech_tree', label: 'Tech Tree', icon: '⚙️' },
		{ value: 'premium', label: 'Premium', icon: '⭐' },
		{ value: 'special', label: 'Special', icon: '🎖️' }
	];
	
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
		const ships = eligibleShips();
		
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
	
	function filterByCategory(category: string) {
		selectedCategories = new Set([category]);
		selectedShip = null;
		sidebarOpen = true;
	}
	
	// View ship stats
	function handleViewStats(ship: WargamingShip) {
		statsModalShip = ship;
	}
	
	// Reset all filters to default (everything selected)
	function resetAllFilters() {
		selectedNations = new Set(data.nations);
		selectedTiers = new Set(data.tiers.map(t => t.toString()));
		selectedTypes = new Set(data.types);
		selectedCategories = new Set(['tech_tree', 'premium', 'special']);
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
				
				<FilterSelect
					label="Category"
					selectedValues={selectedCategories}
					onchange={(vals) => { selectedCategories = vals; selectedShip = null; }}
					options={categoryOptions}
				/>
				
				<!-- Favorites Only Toggle -->
				<div class="mt-6">
					<button
						onclick={() => { showFavoritesOnly = !showFavoritesOnly; selectedShip = null; }}
						class="w-full px-4 py-3 bg-gradient-to-r {showFavoritesOnly ? 'from-[#d4af37] to-[#f4d03f] text-[#0a1929]' : 'from-[#2a3952] to-[#1a2942] text-[#7a8b99]'} hover:brightness-110 font-bold rounded-lg border-2 border-[#d4af37] transition-all text-sm flex items-center justify-between"
					>
						<span class="flex items-center gap-2">
							<span class="text-lg">⭐</span>
							<span>Favorites Only</span>
						</span>
						<span class="text-xs opacity-75">{favorites.size}</span>
					</button>
				</div>
			</div>
			
			<!-- Ship Count in Sidebar -->
			<div class="mt-8 pt-6 border-t-2 border-[#d4af37]">
				<div class="text-[#7a8b99] text-center">
					<div class="text-[#d4af37] font-bold text-3xl">{filteredShips().length}</div>
					<div class="text-sm mt-1">ships available</div>
				</div>
			</div>
			
			<!-- Favorites & Blacklist Management -->
			<div class="mt-6 space-y-4">
				
				<!-- Favorites Count & Clear -->
				<div class="bg-[#1a2942] rounded-lg p-3 border border-[#d4af37]/30">
					<div class="flex items-center justify-between mb-2">
						<span class="text-[#d4af37] text-sm font-semibold flex items-center gap-2">
							<span>⭐</span>
							<span>FAVORITES</span>
						</span>
						<span class="text-[#7a8b99] text-lg font-bold">{favorites.size}</span>
					</div>
					{#if favorites.size > 0}
						<button
							onclick={clearFavorites}
							class="w-full px-3 py-1.5 bg-[#2a3952] hover:bg-[#c41e3a] text-[#7a8b99] hover:text-white font-semibold rounded text-xs transition-all"
						>
							Clear All
						</button>
					{/if}
				</div>
				
				<!-- Blacklist Count & Clear -->
				<div class="bg-[#1a2942] rounded-lg p-3 border border-[#c41e3a]/30">
					<div class="flex items-center justify-between mb-2">
						<span class="text-[#c41e3a] text-sm font-semibold flex items-center gap-2">
							<span>🚫</span>
							<span>BLACKLIST</span>
						</span>
						<span class="text-[#7a8b99] text-lg font-bold">{blacklist.size}</span>
					</div>
					{#if blacklist.size > 0}
						<button
							onclick={clearBlacklist}
							class="w-full px-3 py-1.5 bg-[#2a3952] hover:bg-[#c41e3a] text-[#7a8b99] hover:text-white font-semibold rounded text-xs transition-all"
						>
							Clear All
						</button>
					{/if}
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
					disabled={hasInvalidFilters() || eligibleShips().length === 0 || isRolling}
					rolling={isRolling}
				/>
			</div>
			
			<!-- No eligible ships message -->
			{#if hasInvalidFilters() || eligibleShips().length === 0}
				<div class="mt-4 p-4 bg-[#2a3952] border-2 border-[#d4af37] rounded-lg">
					<p class="text-[#d4af37] font-bold">⚠️ No ships available for randomization</p>
					<p class="text-[#7a8b99] text-sm mt-1">{noShipsReason()}</p>
				</div>
			{/if}
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
				<ShipCard 
					ship={selectedShip} 
					highlighted={true}
					showStats={true}
					onViewStats={handleViewStats}
					onFilterByCategory={filterByCategory}
					isFavorite={favorites.has(selectedShip.ship_id)}
					isBlacklisted={blacklist.has(selectedShip.ship_id)}
					onToggleFavorite={toggleFavorite}
					onToggleBlacklist={toggleBlacklist}
				/>
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
							onFilterByCategory={filterByCategory}
							onViewStats={handleViewStats}
							isFavorite={favorites.has(ship.ship_id)}
							isBlacklisted={blacklist.has(ship.ship_id)}
							onToggleFavorite={toggleFavorite}
							onToggleBlacklist={toggleBlacklist}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Ship Stats Modal -->
<ShipStatsModal 
	ship={statsModalShip}
	onClose={() => statsModalShip = null}
/>
