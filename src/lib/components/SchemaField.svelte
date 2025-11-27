<script lang="ts">
	import type { SchemaFieldType } from "$lib/pouchdb/types";
	import StringSwitch from "./StringSwitch.svelte";
	import Select from "./Select.svelte";

	let { field, value = $bindable() }: { field: SchemaFieldType; value: string } = $props();
</script>

{#if field.name == "string"}
	<input type="text" autocomplete="off" bind:value />
{:else if field.name == "boolean"}
	<StringSwitch bind:value />
{:else if field.name == "number"}
	<input type="text" pattern="[0-9]*" autocomplete="off" bind:value />
{:else if field.name == "select"}
	<Select bind:value options={field.options} />
{/if}
