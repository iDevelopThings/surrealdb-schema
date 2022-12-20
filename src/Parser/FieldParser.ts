import {IParser} from "./IParser";
import {SchemaField} from "../SchemaField";
import {TokenProcessor, TokenGroup} from "./TokenProcessor";

export type FieldParseData = {
	name?: string;
	table?: string;
	type?: string;
	ASSERT?: string;
	PERMISSIONS?: string;
	VALUE?: string;
}

export class FieldParser implements IParser<SchemaField> {

	public tokens: TokenProcessor;
	public line: string        = "";
	public lineTrimmed: string = "";

	constructor(tokens: string[], line: string, lineTrimmed: string) {
		this.tokens      = new TokenProcessor(tokens);
		this.line        = line;
		this.lineTrimmed = lineTrimmed;
	}

	public parse(): SchemaField {
		const field          = new SchemaField();
		field.originalString = this.lineTrimmed;

		const data = this.processTokens();

		field.name        = data.name;
		field.table       = data.table;
		field.type        = data.type;
		field.value       = data.VALUE;
		field.assert      = data.ASSERT;
		field.permissions = data.PERMISSIONS;

		if (field.name.endsWith("[*]")) {
			field.isArrayChild = true;
		}

		if (field.name.includes(".")) {
			field.isObjectPath = true;
		}

		if (field.type.startsWith("record")) {
			field.record = field.type.slice(7, -1);
		}

		field.finalize();

		return field;
	}

	private processTokens(): FieldParseData {

		/**
		 FIELD STATEMENT SYNTAX:

		 DEFINE FIELD @name ON [ TABLE ] @table
			[ TYPE @type ]
			[ VALUE @expression ]
			[ ASSERT @expression ]
			[ PERMISSIONS [ NONE | FULL
				| FOR select @expression
				| FOR create @expression
				| FOR update @expression
				| FOR delete @expression
			] ]
		 */

		const data: FieldParseData = {};


		// Remove first two tokens: ["DEFINE", "FIELD"]
		this.tokens.consume(2);
		data.name = this.tokens.getAndConsume(0);

		// Remove next two tokens:
		// It can be either ["ON"] or ["ON", "TABLE"]
		if (this.tokens.nextAre(["ON", "TABLE"])) {
			this.tokens.consume(2);
		} else if (this.tokens.nextAre(["ON"])) {
			this.tokens.consume(1);
		}

		data.table = this.tokens.getAndConsume(0);

		if (this.tokens.nextAre(["TYPE"])) {
			this.tokens.consume(1);
			data.type = this.tokens.getAndConsume(0);
		}

		const ranges = this.tokens.rangesOfNext(["VALUE", "ASSERT", "PERMISSIONS"]);

		if (ranges.length) {
			const startAt = ranges[0].range.start;
			const endAt   = ranges[ranges.length - 1].range.end;

			for (let group of ranges) {
				const {range}     = group;
				const tokens      = this.tokens.getRange(range.start, range.end + 1);
				data[group.token] = tokens.slice(1).join(" ");
			}

			this.tokens.consume(endAt + 1);
		}

		return data;
	}
}
