<script lang="ts">
	import { faCheck, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
	import { Select } from "melt/builders";
	import { fade } from "svelte/transition";
	import Fa from "svelte-fa";

	let { value = $bindable(), options }: { value?: string; options: string[] } = $props();

	const select = new Select<string>({
		value: value,
		onValueChange: (v) => (value = v ?? undefined),
	});
</script>

<button {...select.trigger} class="button">
	{select.value ?? "Select an option"}
	<span class="chevron"><Fa icon={select.content["data-open"] ? faChevronUp : faChevronDown} /></span>
</button>

<div {...select.content} class="drop" transition:fade={{ duration: 150 }}>
	{#each options as item (item)}
		<div {...select.getOption(item)} class="item">
			{#if select.isSelected(item)}
				<Fa icon={faCheck} />
			{/if}
			{item}
		</div>
	{/each}
</div>

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
		background-color: #717171;
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
