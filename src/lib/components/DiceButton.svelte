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
	class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-lg 
	       shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 
	       disabled:cursor-not-allowed disabled:hover:scale-100"
>
	{#if rolling}
		<span class="inline-block animate-spin">🎲</span>
		Rolling...
	{:else}
		🎲 Roll the Dice!
	{/if}
</button>
