<script lang="ts">
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import TypeForm from "./TypeForm.svelte";

	let { field = $bindable() }: { field: SchemaDoc["fields"][number] } = $props();
</script>

<div class="container">
	<label>
		Name:
		<input type="text" autocomplete="off" placeholder="Field Name" bind:value={field.name} />
	</label>
	<TypeForm bind:type={field.type} />
</div>

<style lang="scss">
	.container {
		flex-direction: column;
		display: flex;
		gap: 10px;
	}
</style>
