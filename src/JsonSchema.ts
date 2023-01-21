import type {JSONSchema7, JSONSchema7Definition} from "json-schema";
import {SchemaTable} from "./SchemaTable";
import {Schema} from "./Schema";
import {SchemaField} from "./SchemaField";

export interface TableSchemaInfo {
	name: string;
	title: string;
	schema: JSONSchema7;
	ref: `#/definitions/${string}`;
}

export class JsonSchema {

	public tablesSchemaInfo: { [key: string]: TableSchemaInfo } = {};

	public tableSchemas: { [key: string]: JSONSchema7 } = {};

	public schema: JSONSchema7 = {};

	constructor() {

	}


	public process(schema: Schema): void {
		for (let key in schema.tables) {
			const table = schema.tables[key];

			this.tablesSchemaInfo[key] = {
				name   : table.name,
				title  : table.title,
				schema : {},
				ref    : `#/definitions/${table.name}`
			};
		}

		for (let key in schema.tables) {
			const table = schema.tables[key];
			this.processTable(table, this.tablesSchemaInfo[key]);
		}

		const finalSchema: JSONSchema7 = {
			$schema     : "http://json-schema.org/draft-07/schema#",
			type        : "object",
			definitions : {},
		};


		for (let tableSchemasKey in this.tablesSchemaInfo) {
			finalSchema.definitions[tableSchemasKey] = this.tablesSchemaInfo[tableSchemasKey].schema;
		}

		for (let tableSchemasKey in this.tablesSchemaInfo) {
			this.tableSchemas[tableSchemasKey] = {
				$schema    : "http://json-schema.org/draft-07/schema#",
				type       : "object",
				properties : this.tablesSchemaInfo[tableSchemasKey].schema.properties,
				definitions: finalSchema.definitions,
			};
		}

		this.schema = finalSchema;
	}

	public processTable(table: SchemaTable, schema: TableSchemaInfo) {
		schema.schema = {
//			$id        : `/tables/${table.name}`,
			type       : "object",
			properties : {},
		};

		for (let fieldsKey in table.fields) {
			const field       = table.fields[fieldsKey];
			const fieldSchema = this.processField(field);
			if (fieldSchema) {
				if (!schema.schema.properties[field.nameNormalized]) {
					schema.schema.properties[field.nameNormalized] = fieldSchema;
				}
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
			if (this.tablesSchemaInfo[field.record]?.ref) {
				delete def.type;
				delete def.title;
				delete def.description;

				def.$ref = this.tablesSchemaInfo[field.record].ref;

				return def;
			}
		}

		if (field.isArrayChild) {
			def.description += " (array child)";

			if (field.isRecord()) {
				def.description += ` - ${field.record}`;
				if (field.record) {
					const ref = this.tablesSchemaInfo[field.record].ref;
					if (ref) {
						def.anyOf = [
							{$ref : ref},
							{type : "string"}
						];
					}
				} else {
					def.type = ["string", "object"];
				}
			}
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
