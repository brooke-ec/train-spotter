import { db } from "$lib/pouchdb";
import type { SchemaDoc } from "$lib/pouchdb/types";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const prerender = false;

export const load: LayoutLoad = async ({ params }) => {
	await db.createIndex({ index: { fields: ["type", "_id"] } });

	const result = await db.find({
		selector: { type: "schema", _id: params.id },
	});

	if (result.docs.length === 0) error(404, "Schema Not Found");

	return {
		schema: result.docs[0] as SchemaDoc,
	};
};
