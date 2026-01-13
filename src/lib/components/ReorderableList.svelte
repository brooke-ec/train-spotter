<script lang="ts" generics="T extends { id: string; [key: string]: any }">
	import { faBars, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
	import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
	import { flip } from "svelte/animate";
	import Fa from "svelte-fa";

	const flipDurationMs = 250;

	let { items = $bindable(), onadd, onclick, label }: Props<T> = $props();
	interface Props<T extends { id: string; [key: string]: any }> {
		onclick?: (index: number) => void;
		label: (i: T) => string;
		onadd?: () => void;
		items: T[];
	}

	function handleDndConsider(e: CustomEvent<DndEvent<T>>) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<T>>) {
		items = e.detail.items;
	}
</script>

<div class="container">
	<div
		use:dragHandleZone={{ items, flipDurationMs, dropTargetStyle: {} }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each items as item, i (item.id)}
			<div class="field" animate:flip={{ duration: flipDurationMs }}>
				<div style="display: flex; align-items: center">
					<span class="handle" use:dragHandle><Fa icon={faBars} /></span>
					{#if onclick}
						<button class="row" onclick={() => onclick(i)}>
							{label(item)}
							<span class="chevron">
								<Fa icon={faChevronRight} />
							</span>
						</button>
					{:else}
						<div class="row">{label(item)}</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	{#if onadd}
		<button class="row" onclick={onadd}>
			<Fa icon={faPlus} /> Add Field
		</button>
	{/if}
</div>

<style lang="scss">
	.container {
		background-color: var(--bg-2);
		border-radius: 5px;
		overflow: hidden;
	}

	.field {
		background-color: var(--bg-2);
		border-radius: 5px;
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
