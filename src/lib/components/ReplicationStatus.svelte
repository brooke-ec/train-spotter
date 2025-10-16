<script lang="ts" module>
	import { status } from "$lib/pouchdb";
	import {
		faCloud,
		faGlobe,
		faPlug,
		faRotate,
		faSatelliteDish,
		faStarOfLife,
		type IconDefinition,
	} from "@fortawesome/free-solid-svg-icons";

	const DISPLAY_MAP = {
		connecting: ["Connecting", faSatelliteDish],
		disconnected: ["Disconnected", faPlug],
		connected: ["Connected", faGlobe],
		outdated: ["Unsaved Changes", faStarOfLife],
		synced: ["Synchronised", faCloud],
		syncing: ["Synchronizing", faRotate],
	} satisfies Record<string, [string, IconDefinition]>;

	export const connection = derived(status.connection, (c) => DISPLAY_MAP[c]);
	export const sync = derived(status.sync, (s) => DISPLAY_MAP[s]);
</script>

<script lang="ts">
	import Fa from "svelte-fa";
	import { derived } from "svelte/store";

	interface Props {
		mode: "sync" | "connection";
		icon?: boolean;
	}

	let { mode, icon = true }: Props = $props();

	let s = $derived(mode == "sync" ? $sync : $connection);
</script>

<span>
	{#if icon}
		<span class="icon"><Fa icon={s[1]} /></span>
	{/if}{s[0]}
</span>

<style lang="scss">
	.icon {
		display: inline-block;
		text-align: center;
		margin-right: 5px;
		width: 20px;
	}
</style>
