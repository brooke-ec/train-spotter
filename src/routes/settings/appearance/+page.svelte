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
</script>

<div class="flexcol">
	<h2>Appearance</h2>
	<p class="secondary">Customise the appearance of the application.</p>
	<h3>App</h3>
	<hr />
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label>
		Navbar Padding
		<Slider
			bind:value={$padding}
			icons={[faGripLinesVertical, faArrowsLeftRightToLine]}
			props={{ max: 30, step: 3 }}
		/>
	</label>
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label>
		Accent Colour
		<button onclick={resetAccent}><Fa icon={faArrowRotateRight} scale="0.85" /></button>
		<Slider bind:value={$accent} props={{ max: 360 }} />
	</label>
	<h3>List</h3>
	<hr />
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label>
		Grouping Period: <span class="secondary">{$grouping ? $grouping + " mins" : "no grouping"}</span>
		<Slider bind:value={$grouping} props={{ max: 60, step: 5 }} />
	</label>
</div>
