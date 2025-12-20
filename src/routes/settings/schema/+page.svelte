<script lang="ts">
	import InfiniteLoading, { type InfiniteEvent } from "svelte-infinite-loading";
	import LinkList from "$lib/components/LinkList.svelte";
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import { spinner } from "../../Loading.svelte";
	import { goto } from "$app/navigation";
	import { icons } from "$lib/util";
	import { db } from "$lib/pouchdb";

	let schemas: SchemaDoc[] = $state([]);
	const LOAD_LIMIT = 25;

	async function load({ detail: { complete, loaded } }: InfiniteEvent) {
		console.log("Loading more schemas...");
		await db.createIndex({ index: { fields: ["name", "type"] } });
		const result = await db.find({
			selector: { $and: [{ type: { $eq: "schema" } }, { name: { $gt: null } }] },
			sort: [{ name: "asc" }],
			skip: schemas.length,
			limit: LOAD_LIMIT,
		});

		schemas.push(...result.docs);
		if (result.docs.length < LOAD_LIMIT) complete();
		else loaded();
	}

	async function create() {
		if (schemas == undefined) return;

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
		goto(`/settings/schema/${id}`);
	}
</script>

<div class="flexcol">
	<h2>Schema</h2>
	<p class="secondary">Schemas define different types of sighting and their properties.</p>
	<hr />

	{#if schemas.length === 0}
		<p class="center">No schemas found</p>
	{:else}
		<LinkList
			items={schemas.map((s) => {
				return {
					url: `/settings/schema/${s._id}`,
					icon: icons[s.icon],
					title: s.name,
					info: s.fields.length.toString() + " fields",
				};
			})}
		/>
	{/if}
	<InfiniteLoading on:infinite={load} />

	<button class="primary" style="align-self: flex-end;" onclick={create}>New Schema</button>
</div>
