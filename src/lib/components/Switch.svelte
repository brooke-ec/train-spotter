<script lang="ts">
	import { createSwitch, createSync, melt } from "@melt-ui/svelte";

	let { value = $bindable(false) }: { value?: boolean } = $props();

	const {
		elements: { root, input },
		states: { checked },
	} = createSwitch();

	const sync = createSync({ value: checked });
	$effect(() => sync.value(value, (v) => (value = v)));
</script>

<div>
	<button use:melt={$root}>
		<span class="thumb"></span>
	</button>
	<input use:melt={$input} />
</div>

<style lang="scss">
	button {
		transition: background-color 250ms;
		border-radius: calc(infinity * 1px);
		background-color: var(--bg-1);

		--w: 2.75rem;
		width: var(--w);
	}

	.thumb {
		transition: transform 250ms;
		display: block;
		border-radius: 50%;
		background-color: white;

		--size: 1.25rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(0);
	}

	button[data-state="checked"] {
		background-color: var(--a-1);

		.thumb {
			transform: translateX(calc(var(--w) - var(--size)));
		}
	}
</style>
