<script lang="ts" module>
	export interface ListProps {
		limit: number;
	}
</script>

<script lang="ts">
	import SightingList from "$lib/components/SightingList.svelte";

	let p: ListProps = $props();
</script>

<SightingList {...p} />
