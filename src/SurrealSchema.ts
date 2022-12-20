import {DbInfoResponse, DbTableResponse, DbResponseResult, DbInfo, TableInfo} from "./DatabaseTypes";
import {Schema} from "./Schema";
import {SchemaField} from "./SchemaField";
import {SchemaParser} from "./Parser/SchemaParser";

export type SurrealDbConfig = {
	namespace: string;
	database: string;
	user: string;
	pass: string;
	host: string,
};


export class SurrealSchema {

	private static _instance: SurrealSchema = null;

	public config: SurrealDbConfig;

	public schema: Schema;

	constructor(config: SurrealDbConfig) {
		if (SurrealSchema._instance) {
			return SurrealSchema._instance;
		}

		this.config = config;

		SurrealSchema._instance = this;
	}

	public static init(config: SurrealDbConfig) {
		return new SurrealSchema(config);
	}

	public async makeQuery<RType>(query: string) {
		const response = await fetch(`${this.config.host}/sql`, {
			method : "POST",

			headers : {
				"Authorization" : `Basic ${btoa(this.config.user + ":" + this.config.pass)}`,
				"Content-Type"  : "application/json",
				"Accept"        : "application/json",
				"NS"            : this.config.namespace,
				"DB"            : this.config.database,
			},
			body    : query,
		});

		return await response.json() as RType;
	}

	public async getDbInfo(): Promise<DbInfoResponse> {
		const info = await this.makeQuery<DbResponseResult<DbInfo>>("INFO FOR DB;");

		return DbInfoResponse.fromJson(info[0]);
	}

	public async getTableInfo(tableName: string): Promise<DbTableResponse> {
		const info = await this.makeQuery<DbResponseResult<TableInfo>>(`INFO FOR TABLE ${tableName};`);

		return DbTableResponse.fromJson(info[0]);
	}

	public async getTablesInfo(tableNames: string[]): Promise<DbTableResponse[]> {
		const info = await this.makeQuery<DbResponseResult<TableInfo>[]>(
			tableNames.map(name => `INFO FOR TABLE ${name};`).join("\n")
		);

		return info.map(DbTableResponse.fromJson);
	}

	public async getSchema(options: GetSchemaConfig = {}): Promise<Schema> {
		const dbInfo     = await this.getDbInfo();
		const tablesInfo = await this.getTablesInfo(dbInfo.getTableNames());

		const schema = new Schema();

		for (let tableName in dbInfo.tables) {
			schema.tables[tableName] = SchemaParser.parseTable(dbInfo.tables[tableName]);

			if (options?.generateId) {
				schema.tables[tableName].fields.id = SchemaField.createForIdField();
			}
		}

		for (let tableInfo of tablesInfo) {
			for (let fieldName in tableInfo.fields) {
				const field = SchemaParser.parseField(tableInfo.fields[fieldName]);

				schema.tables[field.table].fields[fieldName] = field;
			}
		}

		// Now we need to fix array fields up
		for (let tableName in schema.tables) {
			const table = schema.tables[tableName];

			for (let fieldName in table.fields) {
				const field = table.fields[fieldName];

				if (!field.isArrayChild && field.type == "array") {
					const childField = Object.values(table.fields).find(
						f => f.isArrayChild && f.name.includes(field.name)
					);

					if (childField) {
						field.children.push(childField);
					}
				}

				if (options?.handleNestedObjects) {
					if (!field.isObjectPath && field.type == "object") {

						const childFields = Object.values(table.fields).filter(
							f => f.isObjectPath && f.name.includes(field.name + ".")
						);

						if (childFields.length) {
							childFields.sort((a, b) => a.name.length - b.name.length);

							let currentField  = field;
							let previousChild = null;

							for (let childField of childFields) {
								const parts = childField.name.split(".");
								const path  = parts.slice(0, parts.length - 1).join(".");

								if (path == currentField.name || path == previousChild.name) {
									previousChild  = childField;
									const newChild = SchemaField.createNewChild(childField, parts[parts.length - 1]);

									currentField.children.push(newChild);

									if(options?.deleteOriginalNestedObjectFields) {
										delete table.fields[childField.name];
									}

									currentField = newChild;
								}
							}

						}
					}
				}
			}
		}

		this.schema = schema;

		return schema;
	}

}

export type GetSchemaConfig = {
	// When set to true, the schema will generate an ID field for each table
	// This can be useful depending on the case, surreal doesn't include id fields by default
	generateId?: boolean;

	// When set to true, we'll process nested object paths(which are usually defined as separate fields)
	// and nest them into the parent object
	handleNestedObjects?: boolean;

	// When paired with the above option, this will delete all of the original fields
	// Meaning, to find children of an object, you'll have to go through the parent object -> children -> etc
	deleteOriginalNestedObjectFields?: boolean
}
