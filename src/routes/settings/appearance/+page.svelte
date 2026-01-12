<script lang="ts">
	import {
		faArrowRotateRight,
		faArrowsLeftRightToLine,
		faGripLinesVertical,
	} from "@fortawesome/free-solid-svg-icons";
	import Slider from "$lib/components/Slider.svelte";
	import { padding } from "../../Navbar.svelte";
	import { grouping } from "$lib/components/SightingList.svelte";
	import { accent, resetAccent } from "$lib/theme";
	import Fa from "svelte-fa";

	let id = $props.id();
</script>

<div class="flexcol">
	<h2>Appearance</h2>
	<p class="secondary">Customise the appearance of the application.</p>
	<hr />
	<h3>App</h3>
	<div class="box">
		<label>
			Navbar Padding
			<Slider
				bind:value={$padding}
				icons={[faGripLinesVertical, faArrowsLeftRightToLine]}
				max={30}
				step={3}
			/>
		</label>
		<div>
			<label for="{id}-accent">Accent Colour</label>
			<button onclick={resetAccent}><Fa icon={faArrowRotateRight} scale="0.85" /></button>
			<Slider id="{id}-accent" bind:value={$accent} max={360} solid={true} />
		</div>
	</div>
	<h3>List</h3>
	<div class="box">
		<label>
			Grouping Period: <span class="secondary">{$grouping ? $grouping + " mins" : "no grouping"}</span>
			<Slider bind:value={$grouping} max={60} step={5} />
		</label>
	</div>
</div>
