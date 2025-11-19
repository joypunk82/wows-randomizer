<script lang="ts">
	import './layout.css';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>WoWS Randomizer - Random Ship Selector</title>
	<meta name="description" content="Can't decide which ship to play in World of Warships? Let fate decide with WoWS Randomizer!" />
</svelte:head>

{@render children()}
