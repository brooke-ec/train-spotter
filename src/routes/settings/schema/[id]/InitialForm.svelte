<script lang="ts">
	import SchemaInput from "$lib/components/SchemaInput.svelte";
	import type { SchemaField } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";

	let { field = $bindable() }: { field: SchemaField } = $props();
	let id = $props.id();
</script>

<h3>Initial Value</h3>
<div class="box flexcol">
	<div>
		<label for="type-{id}">Type:</label>
		<Select id="type-{id}" bind:value={field.initial.type} options={["none", "fixed", "derived"]} />
	</div>

	{#if field.initial.type === "fixed"}
		<div>
			<label for="value-{id}">Value:</label>
			<SchemaInput id="value-{id}" field={field.type} bind:value={field.initial.value} />
		</div>
	{:else if field.initial.type === "derived"}
		<label>
			Derive Handler URL:
			<input
				type="text"
				autocomplete="off"
				bind:value={field.initial.url}
				placeholder="https://spotter.pages.dev/derive/station"
			/>
		</label>
	{/if}
</div>
