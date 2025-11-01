import type { Component } from "svelte";
import * as z from "zod";

import * as input from "./Input.svelte";
import * as list from "./List.svelte";

interface ElementModule<T extends z.ZodObject> {
	default: Component<z.output<T>>;
	schema: T;
}

function validate<T extends z.ZodObject>(module: ElementModule<T>) {
	return module;
}

export const ELEMENTS = {
	input: validate(input),
	list: validate(list),
};
