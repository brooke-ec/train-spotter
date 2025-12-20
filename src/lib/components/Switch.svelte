<script lang="ts">
	import { Toggle } from "melt/builders";

	let { value = $bindable(false) }: { value?: boolean } = $props();

	const toggle = new Toggle({ value: () => value, onValueChange: (v) => (value = v) });
</script>

<div>
	<button {...toggle.trigger} aria-label="toggle">
		<span class="thumb"></span>
	</button>
	<input {...toggle.hiddenInput} />
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

	button[data-checked] {
		background-color: var(--a-1);

		.thumb {
			transform: translateX(calc(var(--w) - var(--size)));
		}
	}
</style>
