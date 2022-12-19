import {toTitleCase} from "./Utils";

interface ISchemaField {
	originalString: string;
	name: string;
	title: string;
	table: string;
	type: string;
	record: string;
	assert: string;
	children: SchemaField[];
	isArrayChild: boolean;
	isObjectPath: boolean;
	finalize(): void;
	hasChildren(): boolean;
}

export class SchemaField implements ISchemaField {

	public originalString: string;

	public name: string;
	public title: string;

	public table: string;
	public type: string;

	public record: string;
	public assert: string;

	public children: SchemaField[] = [];

	public isArrayChild: boolean = false;
	public isObjectPath: boolean = false;

	public finalize() {
		this.title = toTitleCase(this.name);
	}

	public hasChildren() {
		return this.children.length > 0;
	}

	public static createForIdField() {
		const field = new SchemaField();
		field.name  = "id";
		field.title = "ID";
		field.type  = "id";
		return field;
	}

	public static createNewChild(original: SchemaField, name: string) {
		const field          = new SchemaField();
		field.originalString = original.originalString;
		field.name           = name;
		field.table          = original.table;
		field.type           = original.type;
		field.record         = original.record;
		field.assert         = original.assert;
		field.children       = original.children;
		field.isArrayChild   = original.isArrayChild;
		field.isObjectPath   = original.isObjectPath;
		field.finalize();

		return field;
	}

}
