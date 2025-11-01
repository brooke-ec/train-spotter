<script lang="ts">
	import { get, type DashboardElement } from ".";

	let { elements }: { elements: DashboardElement[] } = $props();
</script>

{#each elements as { type }}
	{@const Component = get(type)}
	<Component />
{/each}
