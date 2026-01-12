<script lang="ts">
	import type { SchemaFieldType } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";
	import ListInput from "$lib/components/ListInput.svelte";

	let { type = $bindable() }: { type: SchemaFieldType } = $props();
	let id = $props.id();
</script>

<h3>Field Type</h3>
<div class="box flexcol">
	<div>
		<label for="type-{id}">Type:</label>
		<Select id="type-{id}" bind:value={type.type} options={["string", "number", "boolean", "select"]} />
	</div>

	{#if type.type === "select"}
		<label>
			Options:
			<ListInput bind:value={type.options} placeholder="Option Name" />
		</label>
	{/if}
</div>
