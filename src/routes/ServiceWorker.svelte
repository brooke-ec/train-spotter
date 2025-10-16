<script lang="ts">
	import { useRegisterSW } from "virtual:pwa-register/svelte";

	const REFRESH_INTERVAL = 20 * 1000; // 20 seconds

	const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
		onRegisteredSW(_, registration) {
			if (registration)
				setInterval(() => {
					console.log("Checking for Service Worker update");
					registration.update();
				}, REFRESH_INTERVAL);
			console.log(`Service Worker Registered: ${registration}`);
		},
		onRegisterError(error) {
			console.log("Service Worker registration error", error);
		},
	});

	function close() {
		offlineReady.set(false);
		needRefresh.set(false);
	}

	let toast = $derived($offlineReady || $needRefresh);
</script>

{#if toast}
	<div class="toast" role="alert">
		<div class="message">
			{#if $offlineReady}
				<span>Spotter has been downloaded and is ready to use offline!</span>
			{:else}
				<span>A new Spotter version is available. Ensure all data is saved before updating.</span>
			{/if}
		</div>
		{#if $needRefresh}
			<button class="primary" onclick={() => updateServiceWorker(true)}>Update</button>
		{/if}
		<button class="secondary" onclick={close}>Close</button>
	</div>
{/if}

<style lang="scss">
	.toast {
		position: fixed;
		right: 0;
		bottom: 0;
		margin: 16px;
		padding: 12px;
		border-radius: 10px;
		z-index: 3;
		text-align: left;
		background-color: var(--bg-0);

		.message {
			margin-bottom: 20px;
		}

		button {
			float: right;
			margin-left: 5px;
		}
	}
</style>
