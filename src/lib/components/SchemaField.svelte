<script lang="ts">
	import type { SchemaFieldType } from "$lib/pouchdb/types";
	import StringSwitch from "./StringSwitch.svelte";
	import Select from "./Select.svelte";

	let { field, value = $bindable() }: { field: SchemaFieldType; value: string } = $props();
</script>

{#if field.type == "string"}
	<input type="text" autocomplete="off" bind:value />
{:else if field.type == "boolean"}
	<StringSwitch bind:value />
{:else if field.type == "number"}
	<input type="text" pattern="[0-9]*" autocomplete="off" bind:value />
{:else if field.type == "select"}
	<Select bind:value options={field.options} />
{/if}
