<script lang="ts" module>
	import type { Component, Snippet } from "svelte";

	interface DialogOptions<T> {
		content: Snippet<[T]>;
		parameters?: T;
		title: string;
	}

	let current: DialogOptions<any> | null = $state(null);

	export function openDialog<T>(options: DialogOptions<T>) {
		current = options;
	}

	export function closeDialog() {
		current = null;
	}
</script>

<script lang="ts">
	import { faXmark } from "@fortawesome/free-solid-svg-icons";
	import { fade } from "svelte/transition";
	import { Dialog } from "melt/builders";
	import Fa from "svelte-fa";

	const dialog = new Dialog({
		onOpenChange(value) {
			if (!value) closeDialog();
		},
	});

	$effect(() => {
		dialog.open = current !== null;
	});
</script>

<div {...dialog.overlay}></div>

<dialog {...dialog.content}>
	{#if current}
		{#key current}
			<div in:fade={{ duration: 300 }}>
				<div class="titlebar">
					<h1>{current.title}</h1>
					<button onclick={() => (dialog.open = false)}><Fa icon={faXmark} scale={1.5} /></button>
				</div>
				<hr />
				<div class="content">
					{@render current.content(current.parameters)}
				</div>
			</div>
		{/key}
	{/if}
</dialog>

<style lang="scss">
	dialog {
		pointer-events: none;
		background: var(--bg-1);
		color: inherit;
		border: none;
		opacity: 0;

		display: flex;
		flex-direction: column;

		min-height: 100vh;
		min-width: 100vw;

		transition: ease 300ms;
		scale: 0.95;
	}

	dialog::backdrop {
		display: none;
	}

	dialog[data-open] {
		pointer-events: all;
		opacity: 1;
		scale: 1;
	}

	[data-melt-dialog-overlay] {
		backdrop-filter: blur(2px);
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.2);
		opacity: 0;
		transition: ease 300ms;
	}

	[data-melt-dialog-overlay][data-open] {
		opacity: 1;
	}

	.titlebar {
		justify-content: space-between;
		align-items: center;
		display: flex;

		button {
			font-size: 20px;
			padding: 0 10px;
		}
	}

	.content {
		flex-grow: 1;
	}
</style>
