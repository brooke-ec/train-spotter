<script lang="ts">
	import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
	import { Slider } from "melt/builders";
	import { ElementSize } from "runed";
	import Fa from "svelte-fa";

	let {
		icons = undefined,
		min = 0,
		max = 100,
		step = 1,
		solid = false,
		value = $bindable(0),
	}: {
		icons?: [IconDefinition, IconDefinition] | undefined;
		min?: number;
		max?: number;
		step?: number;
		solid?: boolean;
		value?: number;
	} = $props();

	const slider = new Slider({
		min,
		max,
		step,
		value: () => value,
		onValueChange: (v) => (value = v),
	});

	let root = $state() as HTMLElement;
	const size = new ElementSize(() => root);

	// Calculate tick positions manually since melt-next doesn't have built-in ticks
	const tickCount = $derived(Math.floor((max - min) / step) + 1);
	const ticks = $derived(
		tickCount <= size.width / 20
			? Array.from({ length: tickCount }, (_, i) => ({
					position: ((i * step) / (max - min)) * 100,
					isBounded: min + i * step <= value,
				}))
			: [],
	);
</script>

<div class="container">
	{#if icons}
		<Fa icon={icons[0]} />
	{/if}
	<span class="root" {...slider.root} bind:this={root}>
		<span class="track">
			{#if !solid}
				<span class="range"></span>
			{/if}
		</span>

		{#each ticks as tick, i (i)}
			<span class="tick" style:left="{tick.position}%" data-bounded={tick.isBounded ? "" : undefined}
			></span>
		{/each}

		<span class="thumb" {...slider.thumb}></span>
	</span>
	{#if icons}
		<Fa icon={icons[1]} />
	{/if}
</div>

<style lang="scss">
	.container {
		align-items: center;
		font-size: 20px;
		margin: 3px 0;
		display: flex;
		gap: 10px;
	}

	.root {
		align-items: center;
		position: relative;
		margin: 2px 15px;
		display: flex;
		height: 30px;
		flex-grow: 1;
	}

	.track {
		background-color: var(--bg-0);
		border-radius: 5px;
		height: 5px;
		width: 100%;

		&:empty {
			background-color: var(--a-1);
		}

		.range {
			position: absolute;
			background-color: var(--a-1);
			border-radius: inherit;
			height: 5px;
			left: 0;
			right: var(--percentage-inv);
		}
	}

	.tick {
		position: absolute;
		background-color: #535353;
		border-radius: 100%;
		height: 3px;
		width: 3px;
		transform: translateX(-50%);

		&[data-bounded] {
			background-color: white;
		}
	}

	.thumb {
		position: absolute;
		left: var(--percentage);
		top: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 0 3px 1px black;
		background-color: white;
		border: solid 2px white;
		border-radius: 100%;
		height: 25px;
		width: 25px;
	}
</style>
