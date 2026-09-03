import type { ComponentProps } from "svelte";
import { ELEMENTS } from "./elements";

export type DashboardElement = {
	[K in keyof typeof ELEMENTS]: { id: string; type: K; props: ComponentProps<(typeof ELEMENTS)[K]> };
}[keyof typeof ELEMENTS];

export function isElement(foo: string): foo is keyof typeof ELEMENTS {
	return foo in ELEMENTS;
}

export function get<T extends keyof typeof ELEMENTS>(type: T): (typeof ELEMENTS)[T] {
	if (!isElement(type)) throw new Error(`Unknown dashboard element type: ${type}`);
	return ELEMENTS[type];
}
