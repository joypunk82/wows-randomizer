<script lang="ts">
	import type { WargamingShip } from '$lib/server/wargaming';
	
	interface Props {
		ship: WargamingShip | null;
		onClose: () => void;
	}
	
	let { ship, onClose }: Props = $props();
	
	// Calculate derived stats
	const winRate = $derived(
		ship && ship.battles && ship.wins
			? ((ship.wins / ship.battles) * 100).toFixed(1)
			: null
	);
	
	const avgDamage = $derived(
		ship && ship.battles && ship.damage_dealt
			? Math.round(ship.damage_dealt / ship.battles)
			: null
	);
	
	const avgXp = $derived(
		ship && ship.battles && ship.xp
			? Math.round(ship.xp / ship.battles)
			: null
	);
	
	const avgFrags = $derived(
		ship && ship.battles && ship.frags
			? (ship.frags / ship.battles).toFixed(2)
			: null
	);
	
	const survivalRate = $derived(
		ship && ship.battles && ship.survived_battles
			? ((ship.survived_battles / ship.battles) * 100).toFixed(1)
			: null
	);
	
	const lastBattle = $derived(() => {
		if (!ship?.last_battle_time) return null;
		const date = new Date(ship.last_battle_time * 1000);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	});
	
	// Handle escape key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
	
	// Type display helper
	function formatType(type: string): string {
		return type.replace('AirCarrier', 'Aircraft Carrier');
	}
	
	// Tier display helper
	function formatTier(tier: number): string {
		if (tier === 11) return '★ (Supership)';
		const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		return tier <= 10 ? romanNumerals[tier - 1] : tier.toString();
	}
	
	// Nation display helper
	function formatNation(nation: string): string {
		const nationMap: Record<string, string> = {
			'japan': 'Japan',
			'usa': 'USA',
			'ussr': 'U.S.S.R.',
			'germany': 'Germany',
			'uk': 'U.K.',
			'france': 'France',
			'pan_asia': 'Pan-Asia',
			'italy': 'Italy',
			'commonwealth': 'Commonwealth',
			'pan_america': 'Pan-America',
			'europe': 'Europe',
			'netherlands': 'Netherlands',
			'spain': 'Spain',
			'portugal': 'Portugal'
		};
		return nationMap[nation] || nation;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if ship}
	<!-- Modal Backdrop -->
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
		onclick={onClose}
		onkeydown={(e) => e.key === 'Enter' && onClose()}
		role="button"
		tabindex="-1"
		aria-label="Close modal"
	>
		<!-- Modal Content -->
		<div 
			class="bg-gradient-to-br from-[#1a2942] to-[#2a3952] border-2 border-[#d4af37] rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="0"
		>
			<!-- Header -->
			<div class="relative p-6 border-b-2 border-[#d4af37]">
				<button
					onclick={onClose}
					class="absolute top-4 right-4 text-[#7a8b99] hover:text-[#d4af37] transition-colors text-2xl font-bold"
					aria-label="Close"
				>
					✕
				</button>
				
				<h2 class="text-3xl font-bold text-[#d4af37] mb-2 pr-8">{ship.name}</h2>
				<div class="flex flex-wrap gap-3 text-sm text-[#aabaca]">
					<span class="flex items-center gap-1">
						<span class="text-[#d4af37]">Tier:</span> {formatTier(ship.tier)}
					</span>
					<span class="flex items-center gap-1">
						<span class="text-[#d4af37]">Type:</span> {formatType(ship.type)}
					</span>
					<span class="flex items-center gap-1">
						<span class="text-[#d4af37]">Nation:</span> {formatNation(ship.nation)}
					</span>
					{#if ship.is_premium}
						<span class="px-2 py-0.5 bg-[#d4af37] text-[#0a1929] rounded text-xs font-bold">PREMIUM</span>
					{/if}
					{#if ship.is_special}
						<span class="px-2 py-0.5 bg-[#c41e3a] text-white rounded text-xs font-bold">SPECIAL</span>
					{/if}
				</div>
			</div>
			
			<!-- Stats Content -->
			<div class="p-6">
				{#if !ship.battles || ship.battles === 0}
					<!-- No Battle Data -->
					<div class="text-center py-12">
						<div class="text-6xl mb-4">⚓</div>
						<h3 class="text-xl font-bold text-[#d4af37] mb-2">No Battle Data</h3>
						<p class="text-[#7a8b99]">You haven't taken this ship into battle yet.</p>
						<p class="text-[#7a8b99] text-sm mt-2">Stats will appear after your first battle!</p>
					</div>
				{:else}
					<!-- Stats Grid -->
					<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
						<!-- Battles -->
						<div class="bg-[#0f1821] border border-[#3a4a5a] rounded-lg p-4">
							<div class="text-xs text-[#7a8b99] mb-1 uppercase tracking-wide">⚔️ Battles</div>
							<div class="text-2xl font-bold text-[#aabaca]">{ship.battles?.toLocaleString()}</div>
						</div>
						
						<!-- Win Rate -->
						{#if winRate}
							<div class="bg-[#0f1821] border border-[#3a4a5a] rounded-lg p-4">
								<div class="text-xs text-[#7a8b99] mb-1 uppercase tracking-wide">🏆 Win Rate</div>
								<div class="text-2xl font-bold text-[#aabaca]">{winRate}%</div>
							</div>
						{/if}
						
						<!-- Avg Damage -->
						{#if avgDamage}
							<div class="bg-[#0f1821] border border-[#3a4a5a] rounded-lg p-4">
								<div class="text-xs text-[#7a8b99] mb-1 uppercase tracking-wide">💥 Avg Damage</div>
								<div class="text-2xl font-bold text-[#aabaca]">{avgDamage.toLocaleString()}</div>
							</div>
						{/if}
						
						<!-- Avg XP -->
						{#if avgXp}
							<div class="bg-[#0f1821] border border-[#3a4a5a] rounded-lg p-4">
								<div class="text-xs text-[#7a8b99] mb-1 uppercase tracking-wide">⭐ Avg XP</div>
								<div class="text-2xl font-bold text-[#aabaca]">{avgXp.toLocaleString()}</div>
							</div>
						{/if}
						
						<!-- Avg Kills -->
						{#if avgFrags}
							<div class="bg-[#0f1821] border border-[#3a4a5a] rounded-lg p-4">
								<div class="text-xs text-[#7a8b99] mb-1 uppercase tracking-wide">💀 Avg Kills</div>
								<div class="text-2xl font-bold text-[#aabaca]">{avgFrags}</div>
							</div>
						{/if}
						
						<!-- Survival Rate -->
						{#if survivalRate}
							<div class="bg-[#0f1821] border border-[#3a4a5a] rounded-lg p-4">
								<div class="text-xs text-[#7a8b99] mb-1 uppercase tracking-wide">🛡️ Survival</div>
								<div class="text-2xl font-bold text-[#aabaca]">{survivalRate}%</div>
							</div>
						{/if}
					</div>
					
					<!-- Last Battle -->
					{#if lastBattle()}
						<div class="mt-6 pt-4 border-t border-[#3a4a5a]">
							<div class="text-sm text-[#7a8b99]">
								<span class="text-[#d4af37] font-semibold">Last Battle:</span> {lastBattle()}
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes scaleIn {
		from { 
			opacity: 0;
			transform: scale(0.95);
		}
		to { 
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.animate-fadeIn {
		animation: fadeIn 0.2s ease-out;
	}
	
	.animate-scaleIn {
		animation: scaleIn 0.2s ease-out;
	}
</style>
