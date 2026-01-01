<script lang="ts">
	import type { SchemaFieldInitial, SchemaFieldType } from "$lib/pouchdb/types";
	import type { SchemaDoc, SightingDoc } from "$lib/pouchdb/types";
	import { spinner } from "../../Spinner.svelte";
	import { db, onChange } from "$lib/pouchdb";
	import { goto } from "$app/navigation";
	import { icons } from "$lib/util";
	import { page } from "$app/state";
	import Fa from "svelte-fa";

	type Fields = {
		[k: string]: {
			value: string;
			type: SchemaFieldType;
			initial: SchemaFieldInitial;
		};
	};

	let sighting: SightingDoc | "not-found" | undefined = $state(undefined);
	let schema: SchemaDoc | "not-found" | "none" | undefined = $state(undefined);
	let fields: Fields = $derived.by(() => {
		let newFields: Fields = {};

		// Add all schema fields
		if (schema != undefined && schema !== "not-found" && schema !== "none") {
			newFields = schema.fields.reduce<Fields>((l, v) => {
				const field: Fields = {
					[v.name]: {
						value: "",
						type: v.type,
						initial: v.initial,
					},
				};
				return Object.assign(l, field);
			}, newFields);
		}

		// Assign values and add any remainging fields
		if (sighting != undefined && sighting !== "not-found" && sighting.fields != null) {
			// Remove last condition after db format migration
			newFields = Object.entries(sighting.fields).reduce<Fields>((l, [name, value]) => {
				let type: SchemaFieldType = { type: "string" };
				if (newFields[name] != null) type = newFields[name].type ?? type;
				let initial: SchemaFieldInitial = { type: "none" };
				if (newFields[name] != null) initial = newFields[name].initial ?? initial;
				const field: Fields = {
					[name]: {
						value: value,
						type: type,
						initial: initial,
					},
				};
				return Object.assign(l, field);
			}, newFields);
		}

		// TODO: Remove temp line from testing
		// Object.assign(newFields, {
		// 	test: {
		// 		value: "",
		// 		type: {type: "string"},
		// 		defaultValue: {type: "fixed", value: "test"},
		// 	}
		// } as Fields)

		return newFields;
	});

	onChange(async () => {
		await db.createIndex({ index: { fields: ["type", "_id"] } });

		const resultSighting = await db.find({
			selector: { type: "sighting", _id: page.params.id },
		});

		if (resultSighting.docs.length === 0) sighting = "not-found";
		else sighting = resultSighting.docs[0] as SightingDoc;

		if (sighting === "not-found") return;

		// Get the sighting's schema
		if (sighting.schema == undefined) {
			schema = "none";
			return;
		}

		const resultSchema = await db.find({
			selector: { type: "schema", _id: sighting.schema },
			limit: 1,
		});

		if (resultSchema.docs.length === 0) schema = "not-found";
		else schema = resultSchema.docs[0] as SchemaDoc;
	});

	function save() {
		if (sighting == undefined || sighting === "not-found") return;

		const newFields = Object.entries(fields).reduce<Record<string, string>>((l, [name, value]) => {
			if (!value.value) return l;
			return Object.assign(l, { [name]: value.value });
		}, {});
		sighting.fields = newFields;

		spinner(db.put(sighting));
	}

	async function remove() {
		if (
			sighting != undefined &&
			sighting !== "not-found" &&
			confirm("Are you sure you want to delete this sighting?")
		) {
			await spinner(db.remove(sighting));
			goto("/sightings");
		}
	}
</script>

{#if sighting === "not-found"}
	<h1>Not Found</h1>
	<p>The sighting you are looking for does not exist.</p>
{:else if sighting != undefined}
	<p class="secondary">{new Date(sighting.time).toLocaleString("en-uk")}</p>
	<h1>
		{#if schema != undefined && schema !== "not-found" && schema !== "none" && schema.icon in icons}
			<Fa icon={icons[schema.icon]} /> -
		{/if}
		{sighting.identification}
	</h1>

	<p class="secondary">
		{#if schema == undefined}
			Schema loading...
		{:else if schema === "none"}
			No schema
		{:else if schema === "not-found"}
			Invalid schema
		{:else}
			Schema: {schema.name}
		{/if}
	</p>

	<div class="fields">
		<label>
			Identification:
			<input type="text" autocomplete="off" placeholder="700128" bind:value={sighting.identification} />
		</label>

		<label>
			Location:
			<input
				type="text"
				autocomplete="off"
				placeholder="Brighton"
				bind:value={sighting.location.custom}
			/>
		</label>

		{#each Object.entries(fields) as [name, value]}
			<label>
				{name}:
				<input
					type="text"
					autocomplete="off"
					placeholder={value.initial.type === "fixed" ? value.initial.value : ""}
					bind:value={value.value}
				/>
			</label>
		{/each}

		{#if sighting.location.geolocation}
			<p class="secondary">
				{sighting.location.geolocation.latitude}° N {sighting.location.geolocation.longitude}° E
			</p>
		{/if}

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
