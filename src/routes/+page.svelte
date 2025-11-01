<script lang="ts" module>
	import * as z from "zod";

	export const schema = z.object();
</script>

<script lang="ts">
	import Dashboard from "$lib/components/dashboard/Dashboard.svelte";

	const elements = [{ type: "input" }, { type: "list" }];
</script>

<Dashboard {elements} />
