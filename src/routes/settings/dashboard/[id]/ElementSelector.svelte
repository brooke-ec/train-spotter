<script lang="ts">
	import { faKeyboard, faList } from "@fortawesome/free-solid-svg-icons";
	import type { ELEMENTS } from "$lib/components/dashboard/elements";
	import Fa from "svelte-fa";

	let { onselect }: { onselect: (type: keyof typeof ELEMENTS) => void } = $props();
</script>

<div class="grid">
	<button onclick={() => onselect("input")} class="box flexcol center">
		<Fa icon={faKeyboard} />
		<h3>Sighting Input</h3>
	</button>
	<button onclick={() => onselect("list")} class="box flexcol center">
		<Fa icon={faList} />
		<h3>Sighting List</h3>
	</button>
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;

		:global(svg) {
			font-size: 30px;
		}
	}
</style>
