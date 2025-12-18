<script lang="ts">
	import Switch from "./Switch.svelte";

	let { value = $bindable() }: { value: string } = $props();
	let raw = $state(false);

	$effect(() => {
		raw = value === "true";
	});

	$effect(() => {
		value = raw ? "true" : "false";
	});
</script>

<Switch bind:value={raw} />
