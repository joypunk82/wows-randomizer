<script lang="ts">
	interface Props {
		label: string;
		options: Array<{ value: string; label: string }>;
		selectedValues: Set<string>;
		onchange: (values: Set<string>) => void;
	}
	
	let { label, options, selectedValues, onchange }: Props = $props();
	
	function toggleValue(value: string) {
		const newValues = new Set(selectedValues);
		if (newValues.has(value)) {
			newValues.delete(value);
		} else {
			newValues.add(value);
		}
		onchange(newValues);
	}
	
	function selectAll() {
		const allValues = new Set(options.map(opt => opt.value));
		onchange(allValues);
	}
	
	function clearAll() {
		onchange(new Set());
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<div class="text-lg font-bold text-[#d4af37] uppercase tracking-wide">{label}</div>
		<div class="flex gap-3">
			<button
				type="button"
				onclick={selectAll}
				class="text-xs text-[#f4d03f] hover:text-[#d4af37] font-semibold uppercase tracking-wide transition-colors"
			>
				Select All
			</button>
			<button
				type="button"
				onclick={clearAll}
				class="text-xs text-[#7a8b99] hover:text-[#d4af37] font-semibold uppercase tracking-wide transition-colors"
			>
				Clear
			</button>
		</div>
	</div>
	<div class="bg-[#0a1929] border-2 border-[#2a3952] rounded-lg p-3 shadow-inner">
		<div class="grid grid-cols-1 gap-1">
			{#each options as option}
				<label class="flex items-center gap-3 py-2 px-3 hover:bg-[#1a2942] rounded cursor-pointer transition-colors group">
					<input
						type="checkbox"
						checked={selectedValues.has(option.value)}
						onchange={() => toggleValue(option.value)}
						class="w-4 h-4 text-[#d4af37] bg-[#1a2942] border-2 border-[#7a8b99] rounded focus:ring-2 focus:ring-[#d4af37] cursor-pointer"
					/>
					<span class="text-sm text-[#7a8b99] group-hover:text-[#d4af37] transition-colors font-medium">
						{option.label}
					</span>
				</label>
			{/each}
		</div>
	</div>
</div>
