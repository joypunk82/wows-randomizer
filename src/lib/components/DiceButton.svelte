<script lang="ts">
	interface Props {
		onclick: () => void;
		disabled?: boolean;
		rolling?: boolean;
	}
	
	let { onclick, disabled = false, rolling = false }: Props = $props();
</script>

<button
	{onclick}
	{disabled}
	class="px-8 py-4 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-[#0a1929] font-black text-xl rounded-lg 
	       shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 
	       disabled:cursor-not-allowed disabled:hover:scale-100 border-2 border-[#0a1929] uppercase tracking-wider"
	style="text-shadow: 1px 1px 2px rgba(255,255,255,0.3);"
>
	{#if rolling}
		Rolling...
	{:else}
		Deploy Random Ship
	{/if}
</button>
