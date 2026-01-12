<script lang="ts">
	import IconSelect from "../../../../lib/components/IconSelect.svelte";
	import { goto, invalidateAll } from "$app/navigation";
	import { spinner } from "../../../Spinner.svelte";
	import FieldInput from "./FieldList.svelte";
	import { db } from "$lib/pouchdb";

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	let schema = $state(data.schema);
	let id = $props.id();

	async function save() {
		await spinner(db.put(schema));
		await invalidateAll();
	}

	async function remove() {
		// TODO ensure no sightings are using this schema / add a migration tool

		if (!confirm("Are you sure you want to delete this schema?")) return;

		await spinner(db.remove(schema));
		goto("/settings/schema");
	}
</script>

<div style="height: 100%; display: flex; flex-direction: column;">
	<h1>
		{data.schema.name}
	</h1>

	<div class="fields">
		<label>
			Name:
			<input type="text" autocomplete="off" placeholder="Schema Name" bind:value={schema.name} />
		</label>

		<div>
			<label for="{id}-icon">Icon:</label>
			<IconSelect id="{id}-icon" bind:value={schema.icon} />
		</div>

		<div>
			<div class="label">Custom Fields:</div>
			<FieldInput bind:schema />
		</div>

		<span>
			<button class="primary" onclick={save}>Save</button>
			<button class="secondary" onclick={remove}>Delete</button>
		</span>
	</div>
</div>

<style lang="scss">
	.fields {
		flex-direction: column;
		margin-top: 15px;
		display: flex;
		height: 100%;
		gap: 10px;
	}
</style>
