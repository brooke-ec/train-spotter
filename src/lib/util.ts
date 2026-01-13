import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { writable, type Readable, type Writable } from "svelte/store";
export { openDialog, closeDialog } from "../routes/Dialog.svelte";
import * as fortawesome from "@fortawesome/free-solid-svg-icons";
export { spinner } from "../routes/Spinner.svelte";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function gettable<T, S>(store: S & Readable<T>): { get: () => T } & S {
	let value: T;
	store.subscribe((v) => (value = v));
	return {
		...store,
		get(): T {
			return value;
		},
	};
}

export function persist<T>(key: string): Writable<T | undefined>;
export function persist<T>(key: string, initial: T): Writable<T>;
export function persist<T>(key: string, initial?: T): Writable<T> {
	const store = writable(JSON.parse(localStorage.getItem(key) ?? "null") ?? initial);
	store.subscribe((v) => {
		if (v === undefined) localStorage.removeItem(key);
		else localStorage.setItem(key, JSON.stringify(v));
	});

	return store;
}

export const icons = Object.fromEntries(
	Object.entries(fortawesome).filter(
		(entry): entry is [string, IconDefinition] =>
			typeof entry[1] === "object" && "iconName" in entry[1] && "icon" in entry[1],
	),
);

export function titleCase(s: string) {
	const result = s.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
}
