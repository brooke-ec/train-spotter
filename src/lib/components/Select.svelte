<script lang="ts">
	import { faCheck, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
	import { createSelect, createSync, melt } from "@melt-ui/svelte";
	import { fade } from "svelte/transition";
	import Fa from "svelte-fa";

	let { value = $bindable(), options }: { value?: string; options: string[] } = $props();

	const {
		elements: { trigger, menu, option },
		states: { selectedLabel, open, selected },
		helpers: { isSelected },
	} = createSelect<string>({
		forceVisible: true,
		positioning: {
			placement: "bottom",
			fitViewport: true,
			sameWidth: true,
		},
	});

	const sync = createSync({ value: selected });
	$effect(() =>
		sync.value(value == undefined ? undefined : { value, label: value }, (v) => (value = v?.value)),
	);
</script>

<button use:melt={$trigger} class="button">
	{$selectedLabel || "Select an option"}
	<span class="chevron"><Fa icon={$open ? faChevronUp : faChevronDown} /></span>
</button>

{#if $open}
	<div use:melt={$menu} class="drop" transition:fade={{ duration: 150 }}>
		{#each options as item}
			<div use:melt={$option({ value: item, label: item })} class="item">
				{#if $isSelected(item)}
					<Fa icon={faCheck} />
				{/if}
				{item}
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.button {
		border: 2px solid var(--bg-4);
		align-items: center;
		border-radius: 5px;
		text-align: left;
		display: block;
		display: flex;
		padding: 5px;
		width: 100%;
	}

	.chevron {
		margin-left: auto;
	}

	.drop {
		background-color: var(--bg-2);
		border-radius: 5px;
		overflow: hidden;
	}

	.item {
		padding: 5px;

		&[data-highlighted] {
			background-color: var(--a-2);
		}

		&[data-selected] {
			background-color: var(--a-1);
		}
	}
</style>
