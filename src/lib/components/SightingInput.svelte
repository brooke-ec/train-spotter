<script lang="ts">
	import { faHashtag, faFont, faTrash } from "@fortawesome/free-solid-svg-icons";
	import { gettable, persist } from "$lib/util";
	import { slide } from "svelte/transition";
	import { sineIn } from "svelte/easing";
	import { db } from "$lib/pouchdb";
	import Fa from "svelte-fa";

	const location = gettable(persist<string>("location", ""));
	let inputs: Input[] = [];
	type Input = {
		id: string;
		value: string;
		simple: boolean;
		binds: { simple?: HTMLInputElement; advanced?: HTMLInputElement };
	};

	// Create new inputs when there are none empty
	$: {
		if (!inputs.some((i) => i.value == ""))
			inputs = [...inputs, { id: crypto.randomUUID(), value: "", simple: true, binds: {} }];
	}

	const focus = (i: number) => inputs[i].binds[inputs[i].simple ? "simple" : "advanced"]?.focus();

	function keyDown(e: KeyboardEvent, i: number) {
		// Keyboard Navigation
		if (e.key == "ArrowUp" && i > 0) focus(i - 1);
		else if (["Enter", "ArrowDown"].includes(e.key) && i < inputs.length - 1) focus(i + 1);
		// Delete empty input when backspace pressed
		else if (["Backspace", "Delete"].includes(e.key) && inputs[i].value == "" && inputs.length > 1) {
			// If attempting to delete the last input, only allow if there are other empty inputs
			if (i != inputs.length - 1 || inputs.filter((i) => i.value == "").length > 1)
				inputs = [...inputs.slice(0, i), ...inputs.slice(i + 1, inputs.length)];
			focus(Math.max(0, i - 1));
		}
	}

	function toggle(i: number) {
		inputs[i].simple = !inputs[i].simple;
		focus(i);
	}

	async function submit() {
		const geolocation = await new Promise<GeolocationCoordinates>((resolve, reject) =>
			navigator.geolocation.getCurrentPosition((p) => resolve(p.coords.toJSON()), reject, {
				enableHighAccuracy: true,
				maximumAge: 1000 * 60,
			}),
		).catch(() => null);

		const time = new Date().getTime();

		db.bulkDocs(
			inputs
				.filter((i) => i.value != "")
				.map((e) => ({
					identification: e.value,
					location: {
						custom: $location,
						geolocation,
					},
					type: "sighting",
					_id: e.id,
					time,
				})),
		);

		inputs = [];
	}

	function clear() {
		if (inputs.length > 0 && confirm("Clear input entries?")) inputs = [];
	}
</script>

<div class="container">
	<label>
		Location:
		<input type="text" autocomplete="off" placeholder="Brighton" bind:value={$location} />
	</label>
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label>
		Sightings:
		<div class="container">
			{#each inputs as input, i (input.id)}
				<span class="input-container" transition:slide={{ easing: sineIn, duration: 150 }}>
					<input
						type="text"
						pattern="[0-9]*"
						autocomplete="off"
						placeholder="700128"
						bind:value={input.value}
						bind:this={input.binds.simple}
						onkeydown={(e) => keyDown(e, i)}
						tabindex={!input.simple ? -1 : undefined}
					/>
					<input
						type="text"
						autocorrect="off"
						autocomplete="off"
						autocapitalize="off"
						placeholder="700128"
						bind:value={inputs[i].value}
						bind:this={input.binds.advanced}
						onkeydown={(e) => keyDown(e, i)}
						tabindex={input.simple ? -1 : undefined}
					/>
					<button class="secondary" onclick={() => toggle(i)}>
						<Fa icon={input.simple ? faHashtag : faFont} />
					</button>
				</span>
			{/each}
		</div>
		<input type="text" class="hidden" onfocus={() => focus(0)} />
	</label>
	<span>
		<button class="primary" onclick={submit}>Submit</button>
		<button class="primary" onclick={clear}><Fa icon={faTrash} /></button>
	</span>
</div>

<style lang="scss">
	.container {
		flex-direction: column;
		display: flex;
		gap: 10px;
	}

	.input-container {
		display: flex;
		gap: 5px;

		input[tabindex="-1"] {
			pointer-events: none;
			position: absolute;
			opacity: 0;
			width: 0;
		}

		button {
			min-width: 35px;
		}
	}
</style>
