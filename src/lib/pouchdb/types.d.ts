/// <reference types="pouchdb-core" />

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
	fields: {
		name: string;
		type: SchemaFieldType;
		initial: SchemaFieldInitial;
	}[];
}>;

export type SchemaFieldType =
	| { name: "string" }
	| { name: "number" }
	| { name: "boolean" }
	| { name: "select"; options: string[] };

export type SchemaFieldInitial =
	| { type: "derived"; url: string }
	| { type: "fixed"; value: string }
	| { type: "none" };

export type AnyDoc = Omit<SightingDoc | SchemaDoc, "_rev", "_id">;
