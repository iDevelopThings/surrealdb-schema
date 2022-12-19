import {toTitleCase} from "./Utils";

interface ISchemaField {
	originalString: string;
	name: string;
	title: string;
	table: string;
	type: string;
	record: string;
	assert: string;
	child: SchemaField;
	isArrayChild: boolean;
	finalize(): void;
}

export class SchemaField implements ISchemaField {

	public originalString: string;

	public name: string;
	public title: string;

	public table: string;
	public type: string;

	public record: string;
	public assert: string;

	public child: SchemaField = null;
	public isArrayChild: boolean = false;

	public finalize() {
		this.title = toTitleCase(this.name);
	}

}
