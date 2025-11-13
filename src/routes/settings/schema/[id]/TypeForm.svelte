<script lang="ts">
	import type { SchemaFieldType } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";
	import ListInput from "$lib/components/ListInput.svelte";

	let { type = $bindable() }: { type: SchemaFieldType } = $props();

	$effect(() => {
		if (type.name === "select" && type.options === undefined) type.options = [];
		// @ts-ignore
		else if (type.name !== "select") delete type.options;
	});
</script>

<div>
	<div class="label">
		Type <hr />
	</div>
	<Select bind:value={type.name} options={["string", "number", "boolean", "select"]} />
</div>

{#if type.name === "select" && type.options !== undefined}
	<label>
		Options:
		<ListInput bind:value={type.options} placeholder="Option Name" />
	</label>
{/if}

<style lang="scss">
</style>
