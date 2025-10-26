<script lang="ts">
	import { faBars, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
	import { createAccordion, melt } from "@melt-ui/svelte";
	import type { Attachment } from "svelte/attachments";
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import FieldForm from "./FieldForm.svelte";
	import { slide } from "svelte/transition";
	import Sortable from "sortablejs";
	import Fa from "svelte-fa";

	let { schema = $bindable() }: { schema: SchemaDoc } = $props();

	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected },
	} = createAccordion();

	const sortable: Attachment<HTMLDivElement> = (element) => {
		const sortable = new Sortable(element, {
			dragClass: "sortable-ghost",
			handle: ".handle",
			animation: 150,
			onEnd(event) {
				if (event.oldIndex === undefined || event.newIndex === undefined) return;
				const movedItem = schema.fields.splice(event.oldIndex, 1)[0];
				schema.fields.splice(event.newIndex, 0, movedItem);
				schema.fields = schema.fields;
			},
		});

		return sortable.destroy.bind(sortable);
	};

	function add() {
		schema.fields.push({
			name: "Unnamed Field",
			type: { type: "string" },
			defaultValue: { type: "none" },
		});
	}
</script>

<div class="container">
	<div {...$root} {@attach sortable}>
		{#each schema.fields as field, i (field.name)}
			{@const props = { value: i.toString() }}
			<div use:melt={$item(props)} data-id={field.name}>
				<div style="display: flex; align-items: center">
					<button use:melt={$trigger(props)}>
						<span class="chevron" class:rotated={$isSelected(props.value)}>
							<Fa icon={faChevronRight} />
						</span>
						{field.name.length > 0 ? field.name : "Unnamed Field"}
					</button>
					<span class="handle"><Fa icon={faBars} /></span>
				</div>
				{#if $isSelected(props.value)}
					<div use:melt={$content(props)} transition:slide class="content">
						<FieldForm bind:field={schema.fields[i]} />
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
		background-color: var(--bg-2);
		border-radius: 5px;
		overflow: hidden;
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

	.sortable-ghost {
		background-color: var(--bg-3);
		border-radius: 5px;

		.content {
			display: none;
		}
	}
</style>
