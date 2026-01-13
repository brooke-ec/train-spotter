<script lang="ts">
	import ReorderableList from "$lib/components/ReorderableList.svelte";
	import IconSelect from "$lib/components/IconSelect.svelte";
	import { goto, invalidateAll } from "$app/navigation";
	import type { SchemaField } from "$lib/pouchdb/types";
	import { openDialog, spinner } from "$lib/util";
	import FieldForm from "./FieldForm.svelte";
	import { db } from "$lib/pouchdb";

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	let schema = $state(data.schema);

	let id = $props.id();

	async function save() {
		await spinner(db.put(schema));
		await invalidateAll();
		goto("/settings/schema");
	}

	async function remove() {
		// TODO ensure no sightings are using this schema / add a migration tool

		if (!confirm("Are you sure you want to delete this schema?")) return;

		await spinner(db.remove(schema));
		goto("/settings/schema");
	}

	function addField() {
		const count = schema.fields.filter((f) => f.name.match(/^New Field( \d+)?$/)).length;
		const name = count === 0 ? "New Field" : `New Field ${count}`;
		schema.fields.push({
			name,
			id: crypto.randomUUID(),
			type: { type: "string" },
			initial: { type: "none" },
		} as SchemaField);
	}

	function clickField(index: number) {
		openDialog({
			content,
			parameters: index,
			title: "Edit Field",
		});
	}
</script>

{#snippet content(index: number)}
	<FieldForm bind:field={schema.fields[index]} remove={() => {}} />
{/snippet}

<div style="height: 100%; display: flex; flex-direction: column;">
	<h1>
		{data.schema.name ?? "Unnamed Schema"}
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
			<ReorderableList
				onadd={addField}
				onclick={clickField}
				bind:items={schema.fields}
				label={(i) => (i.name.length > 0 ? i.name : "Unnamed Field")}
			/>
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
