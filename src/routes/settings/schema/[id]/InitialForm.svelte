<script lang="ts">
	import type { SchemaFieldInitial } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";

	let { initial = $bindable() }: { initial: SchemaFieldInitial } = $props();
</script>

<div>
	<div class="label">
		Initial Value
		<hr />
	</div>
	<Select bind:value={initial.type} options={["none", "fixed", "derived"]} />
</div>

{#if initial.type === "fixed"}
	<label>
		Value:
		<input type="text" autocomplete="off" bind:value={initial.value} placeholder="foobar" />
	</label>
{:else if initial.type === "derived"}
	<label>
		Derive Handler URL:
		<input
			type="text"
			autocomplete="off"
			bind:value={initial.url}
			placeholder="https://spotter.pages.dev/derive/station"
		/>
	</label>
{/if}
