<script lang="ts">
	import { faBars, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
	import { dragHandleZone, dragHandle, type DndEvent } from "svelte-dnd-action";
	import type { SchemaDoc, SchemaField } from "$lib/pouchdb/types";
	import { closeDialog, openDialog } from "$lib/util";
	import FieldForm from "./FieldForm.svelte";
	import { flip } from "svelte/animate";
	import Fa from "svelte-fa";

	const flipDurationMs = 250;
	type IdField = SchemaField & { id: string };

	let { schema = $bindable() }: { schema: SchemaDoc } = $props();
	let fields: IdField[] = $state(schema.fields.map((f) => ({ ...f, id: f.name })));
	$effect(() => {
		schema.fields = fields.map((f) => (({ id, ...r }) => r)(f));
	});

	function add() {
		const count = fields.filter((f) => f.id.match(/^New Field( \d+)?$/)).length;
		const name = count === 0 ? "New Field" : `New Field ${count}`;
		fields.push({
			name,
			id: name,
			type: { type: "string" },
			initial: { type: "none" },
		});
	}

	function remove(id: string) {
		const name = fields.find((f) => f.id === id)?.name || id;
		if (confirm(`Are you sure you want to delete the field "${name}"? This action cannot be undone.`)) {
			fields = fields.filter((f) => f.id !== id);
			closeDialog();
		}
	}

	function handleDndConsider(e: CustomEvent<DndEvent<IdField>>) {
		fields = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<IdField>>) {
		fields = e.detail.items;
	}
</script>

<div class="container">
	<div
		use:dragHandleZone={{ items: fields, flipDurationMs, dropTargetStyle: {} }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each fields as field, i (field.id)}
			<div class="field" animate:flip={{ duration: flipDurationMs }}>
				<div style="display: flex; align-items: center">
					{#snippet content()}
						<FieldForm bind:field={fields[i]} remove={() => remove(field.id)} />
					{/snippet}
					<span class="handle" use:dragHandle><Fa icon={faBars} /></span>
					<button class="row" onclick={() => openDialog({ title: "Edit Field", content })}>
						{field.name.length > 0 ? field.name : "Unnamed Field"}
						<span class="chevron">
							<Fa icon={faChevronRight} />
						</span>
					</button>
				</div>
			</div>
		{/each}
	</div>
	<button onclick={add} class="row">
		<Fa icon={faPlus} /> Add Field
	</button>
</div>

<style lang="scss">
	.container {
		background-color: var(--bg-3);
		border-radius: 5px;
		overflow: hidden;
	}

	.field {
		background-color: var(--bg-3);
	}

	.row {
		justify-content: left;
		align-items: center;
		display: flex;
		padding: 10px;
		width: 100%;
		gap: 10px;
	}

	.handle {
		padding: 10px;
	}

	.chevron {
		transition: transform 250ms ease-in-out;
		transform: rotate(0deg);
		margin-left: auto;
	}
</style>
