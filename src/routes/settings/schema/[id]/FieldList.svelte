<script lang="ts">
	import { faBars, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
	import { dragHandleZone, dragHandle, type DndEvent } from "svelte-dnd-action";
	import { createAccordion, melt } from "@melt-ui/svelte";
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import FieldForm from "./FieldForm.svelte";
	import { slide } from "svelte/transition";
	import { flip } from "svelte/animate";
	import Fa from "svelte-fa";

	const flipDurationMs = 250;
	type IdField = SchemaDoc["fields"][number] & { id: string };

	let { schema = $bindable() }: { schema: SchemaDoc } = $props();
	let fields: IdField[] = $state(schema.fields.map((f) => ({ ...f, id: f.name })));
	$effect(() => {
		schema.fields = fields.map((f) => (({ id, ...r }) => r)(f));
	});

	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected },
	} = createAccordion();

	function add() {
		const count = fields.filter((f) => f.id.match(/^New Field( \d+)?$/)).length;
		const name = count === 0 ? "New Field" : `New Field ${count}`;
		fields.push({
			name,
			id: name,
			type: { name: "string" },
			initial: { type: "none" },
		});
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
		{...$root}
		use:dragHandleZone={{ items: fields, flipDurationMs, dropTargetStyle: {} }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each fields as field, i (field.id)}
			{@const props = { value: field.id }}
			<div use:melt={$item(props)} class="field" animate:flip={{ duration: flipDurationMs }}>
				<div style="display: flex; align-items: center">
					<button use:melt={$trigger(props)}>
						<span class="chevron" class:rotated={$isSelected(props.value)}>
							<Fa icon={faChevronRight} />
						</span>
						{field.name.length > 0 ? field.name : "Unnamed Field"}
					</button>
					<span class="handle" use:dragHandle><Fa icon={faBars} /></span>
				</div>
				{#if $isSelected(props.value)}
					<div use:melt={$content(props)} transition:slide class="content">
						<FieldForm bind:field={fields[i]} />
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<button onclick={add}>
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

	button {
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

		&.rotated {
			transform: rotate(90deg);
		}
	}

	.content {
		background-color: var(--bg-2);
		overflow: hidden;
		padding: 0 10px 10px 10px;
	}

	#dnd-action-dragged-el {
		background-color: var(--bg-3) !important;
		border-radius: 5px !important;
	}
</style>
