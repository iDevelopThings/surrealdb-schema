import {SchemaField} from "./SchemaField";
import {SchemaTable} from "./SchemaTable";

export enum DefinedType {
	Field, Table
}

export class SchemaParser {

	public tokens: string[] = [];

	public line: string        = "";
	public lineTrimmed: string = "";

	public type: DefinedType;

	constructor(line: string) {
		const [lineTrimmed, tokens] = this.parseLine(line);

		this.lineTrimmed = lineTrimmed;
		this.tokens      = tokens;

		this.type = this.getDefinedType(tokens);
	}

	public parseLine(line: string): [string, string[]] {
		let lineTrimmed = line.trim();

		if (lineTrimmed.endsWith(";")) {
			lineTrimmed = lineTrimmed.slice(0, -1);
		}

		const tokens = this.tokenize(lineTrimmed);

		return [
			line,
			tokens,
		];
	}

	public getDefinedType(tokens: string[]) {
		if (tokens[0].toLowerCase() !== "define") {
			throw new Error("Invalid define statement: " + tokens.join(" "));
		}

		if (tokens[1].toLowerCase() === "field") {
			return DefinedType.Field;
		}

		if (tokens[1].toLowerCase() === "table") {
			return DefinedType.Table;
		}

		throw new Error("Invalid define statement: " + tokens.join(" "));
	}

	private parseSchemaField(): SchemaField {
		const field          = new SchemaField();
		field.originalString = this.lineTrimmed;

		const defineType = this.getDefinedType(this.tokens);
		if (defineType !== DefinedType.Field) {
			throw new Error("Invalid call to parseField: " + this.lineTrimmed);
		}

		const fieldName = this.tokens[2];

		field.table = this.tokens[4];
		field.name  = fieldName;

		if (field.name.endsWith("[*]")) {
			field.isArrayChild = true;
		}

		if (field.name.includes(".")) {
			field.isObjectPath = true;
		}

		if (this.tokens.length >= 6) {
			const fieldType = this.tokens[6];
			field.type      = fieldType;

			if (fieldType.startsWith("record")) {
				// field type = record(entity_name)
				field.record = fieldType.slice(7, -1);
			}

		}

		if (this.tokens.length >= 8) {
			// The ninth token is the field assert
			// Everything after this, is the assert, so we should grab all the tokens after the 8th token
			field.assert = this.tokens.slice(8).join(" ");
		}

		field.finalize();

		return field;
	}

	private parseSchemaTable(): SchemaTable {
		const table          = new SchemaTable();
		table.originalString = this.lineTrimmed;

		table.name = this.tokens[2];

		table.finalize();

		return table;
	}

	public static parseField(line: string): SchemaField {
		const parser = new SchemaParser(line);
		if (parser.type !== DefinedType.Field) {
			throw new Error("Invalid call to parseField: " + line);
		}

		return parser.parseSchemaField();
	}

	public static parseTable(line: string): SchemaTable {
		const parser = new SchemaParser(line);
		if (parser.type !== DefinedType.Table) {
			throw new Error("Invalid call to parseField: " + line);
		}

		return parser.parseSchemaTable();
	}

	public static parse(line: string) {
		const parser = new SchemaParser(line);

		if (parser.type === DefinedType.Field) {
			return parser.parseSchemaField();
		}

		if (parser.type === DefinedType.Table) {
			throw new Error("Not implemented");
		}

		throw new Error("Invalid type: " + parser.type);
	}

	private tokenize(str: string): string[] {
		return str.split(/\s+/);
	}

}
