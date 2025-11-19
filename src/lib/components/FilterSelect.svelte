<script lang="ts">
	interface Props {
		label: string;
		options: Array<{ value: string; label: string }>;
		value: string;
		onchange: (value: string) => void;
	}
	
	let { label, options, value, onchange }: Props = $props();
</script>

<div class="flex flex-col gap-2">
	<label for={label} class="text-sm font-semibold text-gray-700">{label}</label>
	<select
		id={label}
		bind:value
		onchange={(e) => onchange(e.currentTarget.value)}
		class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
	>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
