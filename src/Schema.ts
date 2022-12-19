import {SchemaTable} from "./SchemaTable";

interface ISchema {
	tables: { [name: string]: SchemaTable };
	hasTable(name: string): boolean;
	getTable(name: string): SchemaTable;
	getTables(): SchemaTable[];
	getTableNames(): string[];
	getFullSchema(): string;
}

export class Schema implements ISchema {

	public tables: { [name: string]: SchemaTable } = {};

	public hasTable(name: string): boolean {
		return this.tables.hasOwnProperty(name);
	}

	public getTable(name: string): SchemaTable {
		return this.tables[name];
	}

	public getTables(): SchemaTable[] {
		return Object.values(this.tables);
	}

	public getTableNames(): string[] {
		return Object.keys(this.tables);
	}

	public getFullSchema(): string {
		const tables = [];
		for (const table of this.getTables()) {
			let tableSchema = [
				"\r\n",
				"//",
				`// Table: ${table.name}`,
				"//",
				"\r\n",
				table.getFullSchema()
			];

			tables.push(tableSchema.flat().join("\r\n"));
		}

		return tables.join("\r\n");
	}

}
