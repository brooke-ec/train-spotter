import type { DashboardDoc } from "$lib/pouchdb/types";
import type { LayoutLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/pouchdb";

export const prerender = false;

export const load: LayoutLoad = async ({ params }) => {
	await db.createIndex({ index: { fields: ["type", "_id"] } });

	const result = await db.find({
		selector: { type: "dashboard", _id: params.id },
	});

	if (result.docs.length === 0) error(404, "Dashboard Not Found");

	return {
		dashboard: result.docs[0] as DashboardDoc,
	};
};
