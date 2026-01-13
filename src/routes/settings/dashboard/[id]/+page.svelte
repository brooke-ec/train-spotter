<script lang="ts">
	import ReorderableList from "$lib/components/ReorderableList.svelte";
	import type { DashboardElement } from "$lib/pouchdb/types.js";
	import ElementSelector from "./ElementSelector.svelte";
	import { goto, invalidateAll } from "$app/navigation";
	import { openDialog, spinner } from "$lib/util";
	import { capitalCase } from "change-case";
	import { db } from "$lib/pouchdb";

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	let dashboard = $state(data.dashboard);

	let id = $props.id();

	async function save() {
		await spinner(db.put(dashboard));
		await invalidateAll();
		goto("/settings/dashboard");
	}

	async function remove() {
		// TODO ensure no sightings are using this schema / add a migration tool

		if (!confirm("Are you sure you want to delete this schema?")) return;

		await spinner(db.remove(dashboard));
		goto("/settings/dashboard");
	}

	function addElement(type: string) {
		dashboard.elements.push({
			id: crypto.randomUUID(),
			props: {},
			type,
		} as DashboardElement);

		clickElement(dashboard.elements.length - 1);
	}

	function clickElement(index: number) {
		openDialog({
			content: element,
			parameters: index,
			title: "Edit Field",
		});
	}

	function selectElement() {
		openDialog({
			content: selector,
			title: "Select an Element",
		});
	}
</script>

{#snippet element(index: number)}
	{JSON.stringify(dashboard.elements[index], null, 2)}
{/snippet}

{#snippet selector()}
	<ElementSelector onselect={addElement} />
{/snippet}

<div style="height: 100%; display: flex; flex-direction: column;">
	<h1>
		{data.dashboard.name ?? "Unnamed Dashboard"}
	</h1>

	<div class="fields">
		<label>
			Name:
			<input type="text" autocomplete="off" placeholder="Schema Name" bind:value={dashboard.name} />
		</label>

		<div>
			<div class="label">Custom Fields:</div>
			<ReorderableList
				onadd={selectElement}
				onclick={clickElement}
				bind:items={dashboard.elements}
				label={(i) => capitalCase(i.type)}
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
