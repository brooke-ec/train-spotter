<script lang="ts">
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import { spinner } from "../../../Loading.svelte";
	import { db, onChange } from "$lib/pouchdb";
	import { goto } from "$app/navigation";
	import { icons } from "$lib/util";
	import { page } from "$app/state";
	import Fa from "svelte-fa";

	let schema: SchemaDoc | "not-found" | undefined = $state();

	onChange(async () => {
		await db.createIndex({ index: { fields: ["type", "_id"] } });

		const result = await db.find({
			selector: { type: "schema", _id: page.params.id },
		});

		if (result.docs.length === 0) schema = "not-found";
		else schema = result.docs[0] as SchemaDoc;
	});

	function save() {
		if (schema == undefined || schema === "not-found") return;

		spinner(db.put(schema));
	}

	async function remove() {
		if (schema == undefined || schema === "not-found") return;

		// TODO ensure no sightings are using this schema / add a migration tool

		if (!confirm("Are you sure you want to delete this schema?")) return;

		await spinner(db.remove(schema));
		goto("/settings/schema");
	}
</script>

{#if schema === "not-found"}
	<h1>Not Found</h1>
	<p>The sighting you are looking for does not exist.</p>
{:else if schema != undefined}
	<h1>
		{#if schema.icon in icons}
			<Fa icon={icons[schema.icon]} /> -
		{/if}
		{schema.name}
	</h1>

	<div class="fields">
		<label>
			Name:
			<input type="text" autocomplete="off" placeholder="new schema" bind:value={schema.name} />
		</label>

		<span style="margin-top: auto;">
			<button class="primary" onclick={save}>Save</button>
			<button class="secondary" onclick={remove}>Delete</button>
		</span>
	</div>

	<style lang="scss">
		.fields {
			flex-direction: column;
			margin-top: 15px;
			display: flex;
			gap: 10px;
		}
	</style>
{/if}
