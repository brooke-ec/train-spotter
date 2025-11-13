<script lang="ts">
	import type { SchemaDoc } from "$lib/pouchdb/types";
	import Select from "$lib/components/Select.svelte";

	let { type = $bindable() }: { type: SchemaDoc["fields"][number]["type"] } = $props();
</script>

<div class="label">
	Type <hr />
</div>

<Select bind:value={type.name} options={["string", "number", "boolean", "select"]} />

<style lang="scss">
</style>
