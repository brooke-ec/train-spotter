<script lang="ts" module>
	import { faCog, faHome, faListCheck } from "@fortawesome/free-solid-svg-icons";
	import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
	import { persist } from "$lib/util";
	import { page } from "$app/state";
	import Fa from "svelte-fa";

	export const padding = persist("navbar-padding", 0);

	const entries: { href: string; label: string; icon: IconDefinition }[] = [
		{ href: "/", label: "Home", icon: faHome },
		{ href: "/sightings", label: "Sightings", icon: faListCheck },
		{ href: "/settings", label: "Settings", icon: faCog },
	];
</script>

<script lang="ts">
	let margin = $state(0);
</script>

<div style="height: {margin}px;"></div>
<nav style="padding-bottom: {$padding}px;" bind:clientHeight={margin}>
	{#each entries as { href, icon, label }}
		<a {href} class:active={page.data.path[0] == href.split("/")[1]}>
			<Fa {icon} /><span>{label}</span>
		</a>
	{/each}
</nav>

<style lang="scss">
	nav {
		border-top: 1px solid var(--bg-4);
		background-color: var(--bg-1);
		align-items: end;
		position: fixed;
		display: flex;
		width: 100%;
		z-index: 2;
		bottom: 0;

		a {
			transition: color 200ms;
			flex-direction: column;
			align-items: center;
			color: var(--bg-4);
			padding: 5px 10px;
			font-size: 20px;
			display: flex;
			flex-grow: 1;
			gap: 5px;

			&.active {
				color: white;
			}

			span {
				font-size: 10px;
			}
		}
	}
</style>
