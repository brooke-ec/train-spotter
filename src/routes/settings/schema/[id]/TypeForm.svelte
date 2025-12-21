<script lang="ts">
	import type { SchemaFieldType } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";
	import ListInput from "$lib/components/ListInput.svelte";

	let { type = $bindable() }: { type: SchemaFieldType } = $props();
</script>

<div>
	<div class="label">
		Type <hr />
	</div>
	<Select bind:value={type.type} options={["string", "number", "boolean", "select"]} />
</div>

{#if type.type === "select"}
	<label>
		Options:
		<ListInput bind:value={type.options} placeholder="Option Name" />
	</label>
{/if}
