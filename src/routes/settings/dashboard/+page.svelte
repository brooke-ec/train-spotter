<script lang="ts">
	import InfiniteLoading, { type InfiniteEvent } from "svelte-infinite-loading";
	import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
	import type { DashboardDoc } from "$lib/pouchdb/types";
	import LinkList from "$lib/components/LinkList.svelte";
	import { spinner } from "../../Spinner.svelte";
	import { goto } from "$app/navigation";
	import { db } from "$lib/pouchdb";

	let dashboards: DashboardDoc[] = $state([]);
	const LOAD_LIMIT = 25;

	async function load({ detail: { complete, loaded } }: InfiniteEvent) {
		await db.createIndex({ index: { fields: ["type"] } });
		const result = await db.find({
			selector: { type: { $eq: "dashboard" } },
			skip: dashboards.length,
			limit: LOAD_LIMIT,
		});

		dashboards.push(...result.docs);
		if (result.docs.length < LOAD_LIMIT) complete();
		else loaded();
	}

	async function create() {
		if (dashboards == undefined) return;

		const id = crypto.randomUUID();

		await spinner(
			db.put({
				type: "dashboard",
				name: "New Dashboard",
				elements: [],
				_id: id,
			}),
		);
		goto(`/settings/dashboard/${id}`);
	}
</script>

<div class="flexcol">
	<h2>Dashboards</h2>
	<p class="secondary">
		Dashboards are customisable pages for displaying information, inputting data and more!
	</p>
	<hr />

	{#if dashboards.length === 0}
		<p class="center">No dashboards found</p>
	{:else}
		<LinkList
			items={dashboards.map((d) => {
				return {
					url: `/settings/dashboard/${d._id}`,
					icon: faTableColumns,
					title: d.name,
				};
			})}
		/>
	{/if}
	<InfiniteLoading on:infinite={load} />

	<button class="primary" style="align-self: flex-end;" onclick={create}>New Dashboard</button>
</div>
