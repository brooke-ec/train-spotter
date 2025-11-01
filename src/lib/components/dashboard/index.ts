import type { Component } from "svelte";
import { ELEMENTS } from "./elements";

export interface DashboardElement {
	type: string;
}

export function get(type: string): Component {
	if (!(type in ELEMENTS)) throw new Error(`Unknown dashboard element type: ${type}`);
	return ELEMENTS[type as keyof typeof ELEMENTS];
}
