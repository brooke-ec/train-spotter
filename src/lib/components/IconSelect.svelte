<script lang="ts">
	import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
	import VirtualList from "svelte-tiny-virtual-list";
	import { icons, titleCase } from "$lib/util";
	import { Combobox } from "melt/builders";
	import { fade } from "svelte/transition";
	import Fa from "svelte-fa";

	let { value = $bindable(), id }: { value: string; id?: string } = $props();

	const keys = Object.keys(icons);
	const toLabel = (key: string) => titleCase(key.substring(2));

	let internalInputValue = $state("");
	let isOpen = $state(false);

	const combobox = new Combobox<string>({
		value: () => value ?? "faCube",
		// open: () => isOpen,
		inputValue: () => (isOpen ? internalInputValue : toLabel(value ?? "faCube")),
		onValueChange: (v) => {
			value = v ?? value;
		},
		onInputValueChange: (v) => {
			internalInputValue = v;
		},
		onOpenChange: (open) => {
			isOpen = open;
			if (open) internalInputValue = "";
		},
	});

	let filtered = $derived(
		combobox.touched
			? keys.filter((k) => k.toLowerCase().includes(combobox.inputValue.toLowerCase()))
			: keys,
	);
</script>

<div style="position: relative;">
	<input type="text" {...combobox.input} class="input" placeholder={toLabel(value ?? "faCube")} {id} />
	<div class="overlay">
		<span class="icon"><Fa icon={icons[value ?? "faCube"]} /></span>
		<span class="chevron"><Fa icon={isOpen ? faChevronUp : faChevronDown} /></span>
	</div>
</div>

{#if isOpen}
	<div {...combobox.content} class="drop" transition:fade={{ duration: 150 }}>
		<VirtualList
			width="100%"
			itemSize={25}
			itemCount={filtered.length}
			height={Math.min(combobox.availableHeight ?? 300, filtered.length * 25)}
		>
			{#snippet item({ index, style })}
				{@const key = filtered[index]}
				{@const label = toLabel(key)}
				<div {style} {...combobox.getOption(key, label)} class="item">
					<Fa icon={icons[key]} />
					{label}
				</div>
			{/snippet}
		</VirtualList>
	</div>
{/if}

<style lang="scss">
	.input {
		padding-left: 33px;
	}

	.overlay {
		pointer-events: none;
		align-items: center;
		position: absolute;
		display: flex;
		padding: 8px;
		inset: 1px;
	}

	.icon {
		font-size: 20px;
	}

	.chevron {
		margin-left: auto;
	}

	.drop {
		background-color: #717171;
		border-radius: 5px;
		overflow-y: scroll;
		z-index: 100;
	}

	.item {
		padding: 5px;

		gap: 5px;
		display: grid;
		grid-template-columns: 20px auto;

		&[aria-selected="true"] {
			background-color: var(--a-1);
		}

		&[data-highlighted] {
			background-color: var(--a-2);
		}
	}
</style>
