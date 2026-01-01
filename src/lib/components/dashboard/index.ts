import type { Component } from "svelte";
import { ELEMENTS } from "./elements";

export interface DashboardElement {
	type: string;
	props: Record<string, any>;
}

export function get(type: string): Component<any> {
	if (!(type in ELEMENTS)) throw new Error(`Unknown dashboard element type: ${type}`);
	return ELEMENTS[type as keyof typeof ELEMENTS];
}
