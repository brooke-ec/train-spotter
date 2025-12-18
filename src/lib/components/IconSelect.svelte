<script lang="ts">
	import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
	import { createCombobox, melt, type ComboboxSelected } from "@melt-ui/svelte";
	import { icons, titleCase } from "$lib/util";
	import { fade } from "svelte/transition";
	import Fa from "svelte-fa";

	let { value = $bindable() }: { value: string } = $props();

	const keys = Object.keys(icons);
	const toOption = (key: string) => ({ value: key, label: titleCase(key.substring(2)) });

	const {
		elements: { menu, input, option },
		states: { open, inputValue, touchedInput, selected },
	} = createCombobox<string, false, ComboboxSelected<false, string>>({
		forceVisible: true,
		positioning: {
			// @ts-ignore
			overflowPadding: { bottom: 100 },
			placement: "bottom",
			fitViewport: true,
			sameWidth: true,
		},
	});

	$effect(() => {
		$selected = toOption(value ?? "faCube");
	});

	$effect(() => {
		value = $selected?.value ?? value;
	});

	$effect(() => {
		if (!$open) $inputValue = $selected?.label ?? "";
		else $inputValue = "";
	});

	let filtered = $derived(
		$touchedInput ? keys.filter((name) => name.toLowerCase().includes($inputValue.toLowerCase())) : keys,
	);
</script>

<div style="position: relative;">
	<input type="text" use:melt={$input} class="input" placeholder={$selected?.label ?? ""} />
	<div class="overlay">
		<span class="icon"><Fa icon={icons[value ?? "faCube"]} /></span>
		<span class="chevron"><Fa icon={$open ? faChevronUp : faChevronDown} /></span>
	</div>
</div>

{#if $open}
	<div use:melt={$menu} class="drop" transition:fade={{ duration: 150 }}>
		{#each filtered as key (key)}
			{@const props = toOption(key)}
			<div use:melt={$option(props)} class="item">
				<!--todo: lazy loading-->
				<Fa icon={icons[key]} />
				{props.label}
			</div>
		{/each}
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
