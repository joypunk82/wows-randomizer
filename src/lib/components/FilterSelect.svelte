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
	
	// Split options into two columns for vertical layout
	function splitIntoColumns(items: typeof options) {
		const mid = Math.ceil(items.length / 2);
		const leftColumn = items.slice(0, mid);
		const rightColumn = items.slice(mid);
		return { leftColumn, rightColumn };
	}
	
	const { leftColumn, rightColumn } = $derived(splitIntoColumns(options));
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
		<div class="grid grid-cols-2 gap-x-1">
			<!-- Left Column -->
			<div class="flex flex-col gap-1">
				{#each leftColumn as option}
					<label class="flex items-center gap-2 py-1.5 px-2 hover:bg-[#1a2942] rounded cursor-pointer transition-colors group">
						<input
							type="checkbox"
							checked={selectedValues.has(option.value)}
							onchange={() => toggleValue(option.value)}
							class="w-4 h-4 text-[#d4af37] bg-[#1a2942] border-2 border-[#7a8b99] rounded focus:ring-2 focus:ring-[#d4af37] cursor-pointer flex-shrink-0"
						/>
						<span class="text-xs text-[#7a8b99] group-hover:text-[#d4af37] transition-colors font-medium">
							{option.label}
						</span>
					</label>
				{/each}
			</div>
			
			<!-- Right Column -->
			<div class="flex flex-col gap-1">
				{#each rightColumn as option}
					<label class="flex items-center gap-2 py-1.5 px-2 hover:bg-[#1a2942] rounded cursor-pointer transition-colors group">
						<input
							type="checkbox"
							checked={selectedValues.has(option.value)}
							onchange={() => toggleValue(option.value)}
							class="w-4 h-4 text-[#d4af37] bg-[#1a2942] border-2 border-[#7a8b99] rounded focus:ring-2 focus:ring-[#d4af37] cursor-pointer flex-shrink-0"
						/>
						<span class="text-xs text-[#7a8b99] group-hover:text-[#d4af37] transition-colors font-medium">
							{option.label}
						</span>
					</label>
				{/each}
			</div>
		</div>
	</div>
</div>
