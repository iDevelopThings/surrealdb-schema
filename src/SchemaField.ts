import {toTitleCase} from "./Utils";
import {DatabaseFieldTypes} from "./DatabaseTypes";

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
	value: string;
	permissions: string;
	finalize(): void;
	hasChildren(): boolean;

	isAny(): boolean;
	isArray(): boolean;
	isBool(): boolean;
	isDatetime(): boolean;
	isDecimal(): boolean;
	isDuration(): boolean;
	isFloat(): boolean;
	isInt(): boolean;
	isNumber(): boolean;
	isObject(): boolean;
	isString(): boolean;

	isRecord(recordType: string[]): boolean;
	isRecord(recordType: string): boolean;
	isRecord(): boolean;
	isRecord(recordType?: string | string[]): boolean;

	getRecordType(): string[] | undefined;
	isGeometry(): boolean;
	hasAssertStatement(): boolean;
	hasValueStatement(): boolean;
	hasPermissionsStatement(): boolean;
}

export class SchemaField implements ISchemaField {

	public originalString: string;

	public name: string;
	public title: string;

	public table: string;
	public type: string;

	public record: string;

	/**
	 * Schema `VALUE` statement
	 */
	public value: string;
	/**
	 * Schema `ASSERT` statement
	 */
	public assert: string;

	/**
	 * Schema `PERMISSIONS` statement
	 */
	public permissions: string;

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

	public isAny(): boolean {
		return this.type === DatabaseFieldTypes.ANY;
	}

	public isArray(): boolean {
		return this.type === DatabaseFieldTypes.ARRAY;
	}

	public isBool(): boolean {
		return this.type === DatabaseFieldTypes.BOOL;
	}

	public isDatetime(): boolean {
		return this.type === DatabaseFieldTypes.DATETIME;
	}

	public isDecimal(): boolean {
		return this.type === DatabaseFieldTypes.DECIMAL;
	}

	public isDuration(): boolean {
		return this.type === DatabaseFieldTypes.DURATION;
	}

	public isFloat(): boolean {
		return this.type === DatabaseFieldTypes.FLOAT;
	}

	public isInt(): boolean {
		return this.type === DatabaseFieldTypes.INT;
	}

	public isNumber(): boolean {
		return this.type === DatabaseFieldTypes.NUMBER;
	}

	public isObject(): boolean {
		return this.type === DatabaseFieldTypes.OBJECT;
	}

	public isString(): boolean {
		return this.type === DatabaseFieldTypes.STRING;
	}

	public isRecord(recordType: string[]): boolean;
	public isRecord(recordType: string): boolean;
	public isRecord(): boolean;
	public isRecord(recordType?: string | string[]): boolean {
		const isRecordType = this.type.includes("record");
		if (!isRecordType) {
			return false;
		}

		if (recordType) {
			const types = this.getRecordType();
			if (!types) return false;

			if (typeof recordType === "string") {
				return types.includes(recordType);
			} else {
				return recordType.every(type => types.includes(type));
			}
		}

		return true;
	}

	public getRecordType(): string[] | undefined {
		if (!this.type.includes("record")) return undefined;

		// type = 'record(TYPE)' or 'record(TYPE1, TYPE2, TYPE3...)'

		const type       = this.type;
		const start      = type.indexOf("(");
		const end        = type.indexOf(")");
		const recordType = type.substring(start + 1, end);

		return recordType.split(",");
	}

	public isGeometry(): boolean {
		return this.type.includes("geometry");
	}

	public hasAssertStatement(): boolean {
		return this.assert !== undefined;
	}

	public hasValueStatement(): boolean {
		return this.value !== undefined;
	}

	public hasPermissionsStatement(): boolean {
		return this.permissions !== undefined;
	}


}
