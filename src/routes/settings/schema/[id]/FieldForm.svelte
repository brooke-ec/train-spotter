<script lang="ts">
	import type { SchemaField } from "$lib/pouchdb/types";
	import InitialForm from "./InitialForm.svelte";
	import TypeForm from "./TypeForm.svelte";
	import { closeDialog } from "$lib/util";

	let { field = $bindable(), remove }: { field: SchemaField; remove: () => void } = $props();
</script>

<div class="flexcol">
	<label>
		Name:
		<input type="text" autocomplete="off" placeholder="Field Name" bind:value={field.name} />
	</label>
	<TypeForm bind:type={field.type} />
	<InitialForm bind:field />

	<div class="controls flexrow right">
		<button class="secondary" onclick={remove}>Delete</button>
		<button class="primary" onclick={closeDialog}>Save</button>
	</div>
</div>
