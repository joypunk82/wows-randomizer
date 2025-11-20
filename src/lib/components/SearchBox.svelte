<script lang="ts">
	interface Props {
		value: string;
		onchange: (value: string) => void;
		placeholder?: string;
	}
	
	let { value = $bindable(), onchange, placeholder = 'Search...' }: Props = $props();
	
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		onchange(target.value);
	}
	
	function clearSearch() {
		value = '';
		onchange('');
	}
</script>

<div class="relative">
	<div class="relative flex items-center">
		<span class="absolute left-3 text-[#5a7a9a] text-sm">🔍</span>
		<input
			type="text"
			{value}
			oninput={handleInput}
			{placeholder}
			class="w-full pl-9 pr-9 py-2.5 bg-[#0f1821] border border-[#3a4a5a] rounded text-[#aabaca] text-sm placeholder-[#5a7a9a] focus:outline-none focus:border-[#5a7a9a] focus:ring-1 focus:ring-[#5a7a9a] transition-all"
		/>
		{#if value}
			<button
				type="button"
				onclick={clearSearch}
				class="absolute right-2 text-[#7a8a9a] hover:text-[#aabaca] transition-colors text-lg font-bold px-1"
				aria-label="Clear search"
			>
				✕
			</button>
		{/if}
	</div>
</div>
