<script lang="ts">
	import { get, type DashboardElement } from ".";

	let { elements }: { elements: DashboardElement[] } = $props();
</script>

{#each elements as { type, props }}
	{@const Component = get(type)}
	<!-- I solemnly swear I am up to no good. -->
	<Component {...props as any} />
{/each}
