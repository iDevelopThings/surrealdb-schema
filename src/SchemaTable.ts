import {SchemaField} from "./SchemaField";
import {toTitleCase} from "./Utils";

interface ISchemaTable {
	originalString: string;
	name: string;
	title: string;
	fields: { [name: string]: SchemaField };
	finalize(): void;
	hasField(name: string): boolean;
	getField(name: string): SchemaField;
	getFieldNames(): string[];
	getFields(): SchemaField[];
	getFullSchema(): string;
}

export class SchemaTable implements ISchemaTable {

	public originalString: string;

	public name: string;
	public title: string;

	public fields: { [name: string]: SchemaField } = {};

	public finalize() {
		this.title = toTitleCase(this.name);
	}

	public hasField(name: string): boolean {
		return this.fields.hasOwnProperty(name);
	}

	public getField(name: string): SchemaField {
		return this.fields[name];
	}

	public getFieldNames(): string[] {
		return Object.keys(this.fields);
	}

	public getFields(): SchemaField[] {
		return Object.values(this.fields);
	}

	public getFullSchema(): string {
		const schema = [
			this.originalString + ";",
			this.getFields().map(field => field.originalString + ";"),
		];

		return schema.flat().join("\r\n");
	}
}
