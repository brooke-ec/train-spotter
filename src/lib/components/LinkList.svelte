<script lang="ts">
	import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
	import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

	interface Props {
		items: { url: string; icon: IconDefinition; title: string; info?: string }[];
	}

	let { items }: Props = $props();
</script>

<div class="group">
	{#each items as item}
		<a href={item.url}>
			<Fa icon={item.icon} />
			<span class="title">{item.title}</span>
			{#if item.info}<span class="info">{item.info}</span>{/if}
			<span class="chevron"><Fa icon={faChevronRight} /></span>
		</a>
	{/each}
</div>

<style lang="scss">
	.group {
		flex-direction: column;
		border-radius: 10px;
		overflow: hidden;
		display: flex;
		gap: 1px;

		a {
			background-color: var(--bg-2);
			justify-content: left;
			align-items: center;
			display: block;
			display: flex;
			padding: 15px;
			width: 100%;
			gap: 10px;

			.title {
				font-weight: 500;
			}

			.info {
				font-size: 14px;
				color: var(--bg-4);

				&::before {
					padding-right: 0.5rem;
					content: "-";
				}
			}

			.chevron {
				margin-left: auto;
				font-size: 14px;
			}
		}
	}
</style>
