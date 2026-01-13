<script lang="ts">
	import { faList, faTableList } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

	let { onselect }: { onselect: (type: string) => void } = $props();
</script>

<div class="grid">
	<button onclick={() => onselect("input")} class="box flexcol center">
		<Fa icon={faTableList} />
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
