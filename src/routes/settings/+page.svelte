<script lang="ts">
	import LinkList from "$lib/components/LinkList.svelte";
	import { connection } from "$lib/components/ReplicationStatus.svelte";
	import {
		faBoxArchive,
		faCube,
		faPalette,
		faPlug,
		faTableColumns,
	} from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";

	let storageUsage: number = $state(100);
	onMount(async () => {
		const { quota, usage } = await navigator.storage.estimate();
		if (quota && usage) storageUsage = Math.ceil((usage / quota) * 100);
	});
</script>

<div class="flexcol">
	<h1>Settings</h1>
	<hr />

	<LinkList
		items={[
			{
				url: "/settings/replication",
				icon: faPlug,
				title: "Replication",
				info: $connection[0],
			},
			{
				url: "/settings/storage",
				icon: faBoxArchive,
				title: "Storage",
				info: storageUsage !== undefined ? `${storageUsage}% Used` : undefined,
			},
			{
				url: "/settings/schema",
				icon: faCube,
				title: "Schema",
			},
		]}
	/>

	<LinkList
		items={[
			{
				url: "/settings/appearance",
				icon: faPalette,
				title: "Appearance",
			},
			{
				url: "/settings/dashboard",
				icon: faTableColumns,
				title: "Dashboards",
			},
		]}
	/>
</div>
