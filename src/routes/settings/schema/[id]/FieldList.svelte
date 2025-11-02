<script lang="ts">
	import { faBars, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
	import { SortableList, sortItems } from "@rodrigodagostino/svelte-sortable-list";
	import { createAccordion, melt } from "@melt-ui/svelte";
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import FieldForm from "./FieldForm.svelte";
	import { slide } from "svelte/transition";
	import Fa from "svelte-fa";

	let { schema = $bindable() }: { schema: SchemaDoc } = $props();

	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected },
	} = createAccordion();

	function add() {
		schema.fields.push({
			name: "Unnamed Field",
			type: { type: "string" },
			defaultValue: { type: "none" },
		});
	}

	function ondragend(e: SortableList.RootEvents["ondragend"]) {
		const { draggedItemIndex, targetItemIndex, isCanceled } = e;
		if (!isCanceled && typeof targetItemIndex === "number" && draggedItemIndex !== targetItemIndex)
			schema.fields = sortItems(schema.fields, draggedItemIndex, targetItemIndex);
	}
</script>

<div class="container">
	<div {...$root}>
		<SortableList.Root gap={0} {ondragend} hasLockedAxis>
			{#each schema.fields as field, i (i)}
				{@const props = { value: i.toString() }}
				<SortableList.Item id={field.name} index={i}>
					<div use:melt={$item(props)} class="field">
						<div style="display: flex; align-items: center">
							<button use:melt={$trigger(props)}>
								<span class="chevron" class:rotated={$isSelected(props.value)}>
									<Fa icon={faChevronRight} />
								</span>
								{field.name.length > 0 ? field.name : "Unnamed Field"}
							</button>
							<SortableList.ItemHandle>
								<span class="handle"><Fa icon={faBars} /></span>
							</SortableList.ItemHandle>
						</div>
						{#if $isSelected(props.value)}
							<div use:melt={$content(props)} transition:slide class="content">
								<FieldForm bind:field={schema.fields[i]} />
							</div>
						{/if}
					</div>
				</SortableList.Item>
			{/each}
		</SortableList.Root>
	</div>
	<button onclick={add}>
		<Fa icon={faPlus} /> Add Field
	</button>
</div>

<style lang="scss">
	.container {
		background-color: var(--bg-2);
		border-radius: 5px;
		overflow: hidden;
	}

	.field {
		background-color: var(--bg-2);
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
		overflow: hidden;
		padding: 0 10px;
	}

	:global(.ssl-ghost .field) {
		background-color: var(--bg-3);
		opacity: 1 !important;
		border-radius: 5px;

		:global(.content) {
			display: none;
		}
	}

	:global(.ssl-item[data-drag-state="ptr-drag"]) > .field {
		opacity: 0.25;
	}
</style>
