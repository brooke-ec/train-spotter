declare module "svelte-tiny-virtual-list" {
	import { Snippet, Component, ComponentProps } from "svelte";

	type OriginalProps =
		import("../node_modules/svelte-tiny-virtual-list/dist/VirtualList.svelte").VirtualListProps;

	interface VirtualListProps extends OriginalProps {
		item: Snippet<[{ style: string; index: number }]>;
		header?: Snippet;
		footer?: Snippet;
	}

	const VirtualList: Component<VirtualListProps>;
	export default VirtualList;
}
