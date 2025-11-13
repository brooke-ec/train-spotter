<script lang="ts">
	import { slide } from "svelte/transition";

	let { value = $bindable([]), placeholder = "value" }: { value: string[]; placeholder?: string } =
		$props();
	let inputs: HTMLInputElement[] = $state([]);

	$effect(() => {
		if (!value.some((i) => i == "")) value.push("");
	});

	function keyDown(e: KeyboardEvent, i: number) {
		// Keyboard Navigation
		if (e.key == "ArrowUp" && i > 0) focus(i - 1);
		else if (["Enter", "ArrowDown"].includes(e.key) && i < value.length - 1) focus(i + 1);
		// Delete empty input when backspace pressed
		else if (["Backspace", "Delete"].includes(e.key) && value[i] == "" && value.length > 1) {
			// If attempting to delete the last input, only allow if there are other empty inputs
			if (i != value.length - 1 || value.filter((i) => i == "").length > 1) value.splice(i, 1);
			focus(Math.max(0, i - 1));
		}
	}

	const focus = (i: number) => inputs[i]?.focus();
</script>

<div class="container">
	{#each value as _, i}
		<input
			type="text"
			{placeholder}
			transition:slide
			bind:value={value[i]}
			bind:this={inputs[i]}
			onkeydown={(e) => keyDown(e, i)}
		/>
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
