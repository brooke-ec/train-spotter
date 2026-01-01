import type { Component } from "svelte";

import Input from "./Input.svelte";
import List from "./List.svelte";

export const ELEMENTS = {
	input: Input,
	list: List,
} satisfies { [key: string]: Component<any> };
