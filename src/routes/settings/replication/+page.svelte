<script lang="ts">
	import { preventDefault } from "svelte/legacy";

	import ReplicationStatus from "$lib/components/ReplicationStatus.svelte";
	import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
	import { connect, credentials, disconnect as close, status } from "$lib/pouchdb";
	import { spinner } from "../../Spinner.svelte";
	import Fa from "svelte-fa";

	const { error } = status;
	let address = $state($credentials?.address ?? "");
	let username = $state($credentials?.username ?? "");
	let password = $state("");

	function submit() {
		credentials.set({ address, username, password });
		spinner(connect());
	}

	function disconnect() {
		credentials.set(undefined);
		spinner(close());
	}
</script>

<div class="flexcol">
	<h2>Replication Credentials</h2>
	<p class="secondary">
		CouchDB database connection credentials for backup and synchronising data between devices.
	</p>
	<ReplicationStatus mode="connection" />
	<ReplicationStatus mode="sync" />
	<hr />
	<form class="flexcol" onsubmit={preventDefault(submit)}>
		<label>
			CouchDB Database Address:
			<input required type="url" placeholder="https://example.com/spotter" bind:value={address} />
		</label>

		<label>
			Database Username:
			<input required type="text" placeholder="username" bind:value={username} />
		</label>

		<label>
			Database Password:
			<input required type="password" placeholder="•••••••" bind:value={password} />
		</label>
		<div class="controls">
			<button type="submit" class="primary">Connect</button>
			<button type="button" class="secondary" onclick={disconnect}>Disconnect</button>
		</div>
	</form>
	{#if $error}
		<span class="alert red"><Fa icon={faCircleExclamation} /> {$error}</span>
	{/if}
</div>
