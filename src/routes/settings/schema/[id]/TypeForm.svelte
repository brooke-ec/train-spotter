<script lang="ts">
	import type { SchemaFieldType } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";
	import ListInput from "$lib/components/ListInput.svelte";

	let { type = $bindable() }: { type: SchemaFieldType } = $props();
	let id = $props.id();
</script>

<div>
	<label for="{id}-type">
		Type <hr />
	</label>
	<Select id="{id}-type" bind:value={type.type} options={["string", "number", "boolean", "select"]} />
</div>

{#if type.type === "select"}
	<label>
		Options:
		<ListInput bind:value={type.options} placeholder="Option Name" />
	</label>
{/if}
