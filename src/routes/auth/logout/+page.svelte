<script lang="ts">
	import { onMount } from 'svelte';
	
	// Force a full page reload to home after logout
	onMount(() => {
		window.location.href = '/';
	});
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="text-center">
		<p class="text-[#7a8b99] text-xl">Logging out...</p>
	</div>
</div>
