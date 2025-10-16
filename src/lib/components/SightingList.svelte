<script lang="ts" module>
	export const grouping = persist("list-grouping", 20);
</script>

<script lang="ts">
	import type { SightingDoc } from "../pouchdb/types";
	import { db, onChange } from "$lib/pouchdb";
	import { persist } from "$lib/util";

	interface Props {
		limit?: number | null;
	}

	let { limit = null }: Props = $props();

	let elements: [undefined | string, SightingDoc][] = $state([]);

	onChange(async () => {
		await db.createIndex({ index: { fields: ["time", "type"] } });

		const result = await db.find({
			selector: { type: "sighting", time: { $gte: null } },
			sort: [{ time: "desc" }],
			...(limit && { limit }),
		});

		const sightings = result.docs as SightingDoc[];
		elements = sightings.map((sighting, i) => {
			// Two days in the future to ensure the day header is added
			let lastTime = Number(sighting.time) + 172800000;
			if (i > 0) lastTime = Number(sightings[i - 1].time);

			let seperator: undefined | string;
			if ($grouping > 0 && (lastTime - Number(sighting.time)) / 60000 > $grouping) seperator = "---";

			const lastDay = new Date(lastTime);
			lastDay.setHours(0, 0, 0, 0);
			const day = new Date(Number(sighting.time));
			day.setHours(0, 0, 0, 0);
			if (lastDay.getTime() != day.getTime())
				seperator = day.toLocaleDateString("en-uk", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});

			return [seperator, sighting];
		});
	});
</script>

<div class="list">
	{#if elements.length === 0}
		<p class="center margin-v">No sightings found</p>
	{:else}
		{#each elements as [seperator, sighting]}
			{#if seperator}
				{#if seperator == "---"}
					<hr class="gap" />
				{:else}
					<div class="heading">{seperator}</div>
				{/if}
			{/if}

			<a class="sighting" href="/sightings/{sighting._id}">
				<span>{sighting.identification}</span>
				<!-- TODO: REMOVE!!! Fallback for old sightings -->
				{#if typeof sighting.location == "string"}
					<span class="location">{sighting.location}</span>
				{:else}
					<span class="location">{sighting.location.custom}</span>
				{/if}
			</a>
		{/each}
	{/if}
</div>

<style lang="scss">
	.list {
		flex-direction: column;
		display: flex;
		width: 100%;

		.heading {
			grid-area: auto / 1 / auto / 3;
			background-color: var(--bg-2);
			border-radius: 5px;
			padding: 5px 5px;
		}

		.sighting {
			white-space: nowrap;
			padding: 2.5px 3px;
		}

		.location {
			text-align: right;
			float: right;
		}

		hr.gap {
			border-color: var(--bg-2);
			margin: 3px 0;
		}
	}
</style>
