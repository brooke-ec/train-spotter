<script lang="ts">
	import "greset";
	import "./style.scss";
	import "./transition.scss";
	import "$lib/theme";

	import { createBrowserHistory, Action } from "history";
	import { onNavigate } from "$app/navigation";
	import { pwaInfo } from "virtual:pwa-info";
	import Loading from "./Loading.svelte";
	import Backbar from "./Backbar.svelte";
	import Navbar from "./Navbar.svelte";

	let { data, children } = $props();

	let popping = false;
	createBrowserHistory().listen(({ action }) => {
		if (action == Action.Pop) popping = true;
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition || popping) {
			popping = false;
			return;
		}

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Loading />

<div style="flex-direction: column; display: flex; height: 100vh;">
	{#if data.path.length > 1}
		<Backbar />
	{/if}

	<div style="overflow-x: hidden; flex-grow: 1">
		<main>
			{@render children?.()}
		</main>
	</div>

	<Navbar />
</div>

<!-- PWA Metadata -->
<svelte:head>
	{@html pwaInfo ? pwaInfo.webManifest.linkTag : ""}
	<meta name="apple-mobile-web-app-title" content="Spotter" />
</svelte:head>

{#await import("./ServiceWorker.svelte") then { default: ServiceWorker }}
	<ServiceWorker />
{/await}
