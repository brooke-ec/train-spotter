<script lang="ts">
	import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
	import { createCombobox, melt, type ComboboxSelected } from "@melt-ui/svelte";
	import { InfiniteLoader, LoaderState } from "svelte-infinite";
	import { icons, titleCase } from "$lib/util";
	import { fade } from "svelte/transition";
	import { watch } from "runed";
	import Fa from "svelte-fa";

	let { value = $bindable() }: { value: string } = $props();

	const keys = Object.keys(icons);
	const toOption = (key: string) => ({ value: key, label: titleCase(key.substring(2)) });

	const {
		elements: { menu, input, option },
		states: { open, inputValue, selected },
	} = createCombobox<string, false, ComboboxSelected<false, string>>({
		forceVisible: true,
		positioning: {
			// @ts-ignore
			overflowPadding: { bottom: 10 },
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

	let drop = $state<HTMLDivElement>();
	let loaded: string[] = $state([]);
	let loader = new LoaderState();
	let index = 0;

	async function load() {
		for (let i = 0; i < 50; i++) {
			if (index >= keys.length) {
				loader.complete();
				return;
			}

			const key = keys[index];
			if (key.toLowerCase().includes($inputValue.toLowerCase())) loaded.push(key);
			else i--;
			index++;
		}

		loader.loaded();
	}

	watch(
		() => $inputValue,
		() => {
			index = 0;
			loaded = [];
			loader.reset();
			drop?.scrollTo(0, 0);
			load();
		},
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
	<div use:melt={$menu} class="drop" transition:fade={{ duration: 150 }} bind:this={drop}>
		{#await new Promise((r) => requestAnimationFrame(r)) then}
			<InfiniteLoader
				triggerLoad={load}
				loaderState={loader}
				intersectionOptions={{ root: drop }}
				loopMaxCalls={Number.POSITIVE_INFINITY}
			>
				{#each loaded as key (key)}
					{@const props = toOption(key)}
					<div use:melt={$option(props)} class="item">
						<Fa icon={icons[key]} />
						{props.label}
					</div>
				{/each}
			</InfiniteLoader>
		{/await}
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

		&[data-highlighted] {
			background-color: var(--a-2);
		}

		&[data-selected] {
			background-color: var(--a-1);
		}
	}
</style>
