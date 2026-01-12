<script lang="ts">
	import Switch from "./Switch.svelte";

	let { value = $bindable(), id }: { value: string; id?: string } = $props();
	let raw = $state(false);

	$effect(() => {
		raw = value === "true";
	});

	$effect(() => {
		value = raw ? "true" : "false";
	});
</script>

<Switch {id} bind:value={raw} />
