<script lang="ts">
	import Dashboard from "$lib/components/dashboard/Dashboard.svelte";
	import type { DashboardElement } from "$lib/components/dashboard";

	const elements: DashboardElement[] = [
		{ id: "foo", type: "input", props: {} },
		{ id: "bar", type: "list", props: { limit: 10 } },
	];
</script>

<div class="dashboard">
	<Dashboard {elements} />
</div>

<style lang="scss">
	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
</style>
