<script lang="ts">
	import LinkList from "$lib/components/LinkList.svelte";
	import ReplicationStatus, { connection } from "$lib/components/ReplicationStatus.svelte";
	import {
		faBoxArchive,
		faChevronRight,
		faCube,
		faPalette,
		faPlug,
	} from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";
	import Fa from "svelte-fa";

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
		]}
	/>

	<!-- <div class="group">
		<a href="/settings/replication">
			<Fa icon={faPlug} />
			<span class="title">Replication</span>
			<span class="info"><ReplicationStatus mode="connection" icon={false} /></span>
			<span class="chevron"><Fa icon={faChevronRight} /></span>
		</a>
		<a href="/settings/storage">
			<Fa icon={faBoxArchive} />
			<span class="title">Storage</span>
			{#if storageUsage !== undefined}<span class="info">{storageUsage}% Used</span>{/if}
			<span class="chevron"><Fa icon={faChevronRight} /></span>
		</a>
		<a href="/settings/schema">
			<Fa icon={faCube} />
			<span class="title">Schema</span>
			<span class="chevron"><Fa icon={faChevronRight} /></span>
		</a>
	</div>

	<div class="group">
		<a href="/settings/appearance">
			<Fa icon={faPalette} />
			<span class="title">Appearance</span>
			<span class="chevron"><Fa icon={faChevronRight} /></span>
		</a>
	</div> -->
</div>
