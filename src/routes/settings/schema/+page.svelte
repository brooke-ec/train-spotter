<script lang="ts">
	import LinkList from "$lib/components/LinkList.svelte";
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import { spinner } from "../../Loading.svelte";
	import { db, onChange } from "$lib/pouchdb";
	import { goto } from "$app/navigation";
	import { icons } from "$lib/util";

	let schema: SchemaDoc[] | undefined = $state();
	// Schema limit for db query, remove after implementing lazy loading
	const schemaLimit: number = 20;

	onChange(async () => {
		await db.createIndex({ index: { fields: ["name", "type"] } });
		const result = await db.find({
			selector: { $and: [{ type: { $eq: "schema" } }, { name: { $gt: null } }] },
			sort: [{ name: "asc" }],
			limit: schemaLimit + 5,
		});
		schema = result.docs as SchemaDoc[];
	});

	async function create() {
		if (schema == undefined) return;
		if (schema.length >= schemaLimit) return;

		const id = crypto.randomUUID();

		await spinner(
			db.put({
				type: "schema",
				icon: "faCube",
				name: "new schema",
				fields: [],
				_id: id,
			}),
		);
		goto("/settings/schema/" + id);
	}
</script>

<div class="flexcol">
	<h2>Schema</h2>
	<p class="secondary">Schemas define different types of sighting and their properties.</p>
	<hr />

	{#if schema != undefined}
		{#if schema.length === 0}
			<p class="center">No schemas found</p>
		{:else}
			<LinkList
				items={schema.map((v) => {
					return {
						url: "/settings/schema/" + v._id,
						icon: icons[v.icon],
						title: v.name,
						info: v.fields.length.toString() + " fields",
					};
				})}
			/>
		{/if}

		<p class="secondary">{schema.length}/{schemaLimit} schemas</p>
	{/if}

	<button
		class="primary"
		style="align-self: flex-end;"
		disabled={schema == undefined || schema.length >= schemaLimit}
		onclick={create}>New Schema</button
	>
</div>
