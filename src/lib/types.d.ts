export type SchemaFieldType = {
	type: "string"
} | {
	type: "number"
} | {
	type: "select"
	options: string[]
};

export type SchemaDefaultValue = {
	type: "fixed",
    value: string
} | {
	type: "none"
};