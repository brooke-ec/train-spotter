<script lang="ts">
	import type { SchemaFieldType } from "$lib/pouchdb/types";
	import StringSwitch from "./StringSwitch.svelte";
	import Select from "./Select.svelte";

	let { field, value = $bindable(), id }: { field: SchemaFieldType; value: string; id?: string } = $props();
</script>

{#if field.type == "string"}
	<input {id} type="text" autocomplete="off" bind:value />
{:else if field.type == "boolean"}
	<StringSwitch {id} bind:value />
{:else if field.type == "number"}
	<input {id} type="text" pattern="[0-9]*" autocomplete="off" bind:value />
{:else if field.type == "select"}
	<Select {id} bind:value options={field.options} />
{/if}
