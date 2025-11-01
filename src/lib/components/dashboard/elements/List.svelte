<script lang="ts" module>
	import * as z from "zod";

	export const schema = z.object({
		limit: z.number().min(1).default(25),
	});
</script>

<script lang="ts">
	import SightingList from "$lib/components/SightingList.svelte";

	let p: z.output<typeof schema> = $props();
</script>

<SightingList {...p} />
