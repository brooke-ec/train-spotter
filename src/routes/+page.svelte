<script lang="ts">
	import Dashboard from "$lib/components/dashboard/Dashboard.svelte";

	const elements = [
		{ type: "input", props: {} },
		{ type: "list", props: { limit: 10 } },
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
