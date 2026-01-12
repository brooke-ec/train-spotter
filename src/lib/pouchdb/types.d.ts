/// <reference types="pouchdb-core" />

import type { DashboardElement } from "$lib/components/dashboard";

export type SightingDoc = PouchDB.Core.ExistingDocument<{
	identification: string;
	type: "sighting";
	time: number;
	location: {
		geolocation: GeolocationCoordinates | null;
		custom: string;
	};
	schema: string;
	fields: Record<string, string>;
}>;

export type SchemaDoc = PouchDB.Core.ExistingDocument<{
	type: "schema";
	icon: string;
	name: string;
	fields: SchemaField[];
}>;

export type DashboardDoc = PouchDB.Core.ExistingDocument<{
	type: "dashboard";
	name: string;
	elements: DashboardElement[];
}>;

export type SchemaField = {
	name: string;
	type: SchemaFieldType;
	initial: SchemaFieldInitial;
};

export type SchemaFieldType =
	| { type: "string" }
	| { type: "number" }
	| { type: "boolean" }
	| { type: "select"; options: string[] };

export type SchemaFieldInitial =
	| { type: "derived"; url: string }
	| { type: "fixed"; value: string }
	| { type: "none" };

export type AnyDoc = Omit<SightingDoc | SchemaDoc, "_rev", "_id">;
