import type {JSONSchema7, JSONSchema7Definition} from "json-schema";
import {SchemaTable} from "./SchemaTable";
import {Schema} from "./Schema";
import {SchemaField} from "./SchemaField";

export interface TableSchemaInfo {
	name: string;
	title: string;
	schema: JSONSchema7Definition;
	ref: `#/defs/${string}`;
}

export class JsonSchema {

	public tableSchemas: { [key: string]: TableSchemaInfo } = {};

	public schema: JSONSchema7 = {};

	constructor() {

	}


	public process(schema: Schema): void {
		for (let key in schema.tables) {
			const table = schema.tables[key];

			this.tableSchemas[key] = {
				name   : table.name,
				title  : table.title,
				schema : {},
				ref    : `#/defs/${table.name}`
			};
		}

		for (let key in schema.tables) {
			const table = schema.tables[key];
			this.processTable(table, this.tableSchemas[key]);
		}

		const finalSchema: JSONSchema7 = {
			$schema : "http://json-schema.org/draft-07/schema#",
			$id     : "/tables",
			type    : "object",
			$defs   : {},
		};


		for (let tableSchemasKey in this.tableSchemas) {
			finalSchema.$defs[tableSchemasKey] = this.tableSchemas[tableSchemasKey].schema;
		}

		this.schema = finalSchema;
	}

	public processTable(table: SchemaTable, schema: TableSchemaInfo) {
		schema.schema = {
			$id        : `/tables/${table.name}`,
			type       : "object",
			properties : {},
		};

		for (let fieldsKey in table.fields) {
			const field       = table.fields[fieldsKey];
			const fieldSchema = this.processField(field);
			if (fieldSchema) {
				if (schema.schema.properties[field.nameNormalized]) {
					console.log(".");
				}
				schema.schema.properties[field.nameNormalized] = fieldSchema;
			}
		}

	}

	private processField(field: SchemaField): JSONSchema7Definition {
		const def: JSONSchema7Definition = {
			type        : field.typeToJSONSchema(),
			title       : field.title,
			description : `${field.title} (${field.nameNormalized}) - ${field.type}`
		};

		if (field.isRecord() && field.record) {
			if (this.tableSchemas[field.record]?.ref) {
				delete def.type;
				delete def.title;
				delete def.description;

				def.$ref = this.tableSchemas[field.record].ref;

				return def;
			}
		}

		if (field.isArrayChild) {
			def.description += " (array child)";
		} else if (field.isArray()) {
			def.type            = "array";
			def.additionalItems = true;

			if (field.children.length) {
				def.items = field.children.map(child => {
					return this.processField(child);
				});
			}
		}

		return def;
	}
}
