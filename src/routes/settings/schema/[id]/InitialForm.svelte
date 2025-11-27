<script lang="ts">
	import SchemaField from "$lib/components/SchemaField.svelte";
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";

	let { field = $bindable() }: { field: SchemaDoc["fields"][number] } = $props();
</script>

<div>
	<div class="label">
		Initial Value
		<hr />
	</div>
	<Select bind:value={field.initial.type} options={["none", "fixed", "derived"]} />
</div>

{#if field.initial.type === "fixed"}
	<label>
		Value:
		<SchemaField field={field.type} bind:value={field.initial.value} />
	</label>
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
