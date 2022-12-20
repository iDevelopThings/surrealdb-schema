import {describe, it, expect} from "vitest";
import {SurrealSchema} from "../src/SurrealSchema";

function getInstance() {
	return SurrealSchema.init({
		host      : "http://127.0.0.1:4269",
		user      : "root",
		pass      : "secret",
		namespace : "test",
		database  : "test",
	});
}

describe("SurrealSchema", () => {

	it("can be initialized", () => {
		const schema = getInstance();

		expect(schema).toBeDefined();
	});

	it("can get db info", async () => {
		const schema = getInstance();
		const info   = await schema.getDbInfo();

		expect(info).toBeDefined();
		expect(info.tables.account).toBeDefined();
	});

	it("can get table info", async () => {
		const schema = getInstance();
		const info   = await schema.getTableInfo("account");

		expect(info).toBeDefined();
		expect(Object.keys(info.fields).length > 0).toBe(true);
	});

	it("can get tables info", async () => {
		const schema = getInstance();
		const info   = await schema.getTablesInfo(["account", "user"]);

		expect(info).toBeDefined();
		expect(info.length).toBe(2);
		expect(info[0].fields).toBeDefined();
		expect(info[1].fields).toBeDefined();
	});

	it("can get schema", async () => {
		const schema = getInstance();
		const info   = await schema.getSchema();

		const table = info.tables.account;

		expect(table).toBeDefined();

		expect(table.fields.account_type.isString()).toBeTruthy();
		expect(table.fields["account_type"].isString()).toBeTruthy();
		expect(table.fields["has_split_account"].isBool()).toBeTruthy();
		expect(table.fields["username"].isString()).toBeTruthy();

		expect(table.fields["other"].isArray()).toBeTruthy();
		expect(table.fields["other[*]"].isArrayChild).toBeTruthy();
		expect(table.fields["other[*].name"].isString()).toBeTruthy();

		expect(table.fields["profiles"].isArray()).toBeTruthy();
		expect(table.fields["profiles[*]"].isArrayChild).toBeTruthy();
		expect(table.fields["profiles[*]"].isRecord()).toBeTruthy();
		expect(table.fields["profiles[*]"].isRecord("profile")).toBeTruthy();

		expect(table.fields["subThing"].isObject()).toBeTruthy();
		expect(table.fields["subThing.data"].isObject()).toBeTruthy();
		expect(table.fields["subThing.data.key"].isObject()).toBeTruthy();
		expect(table.fields["subThing.data.key.value"].isString()).toBeTruthy();


	});

	it("can run type checks for field types", async () => {
		const schema = getInstance();
		const info   = await schema.getSchema();

		expect(info).toBeDefined();
		expect(info.tables.account).toBeDefined();
		expect(info.tables.profile).toBeDefined();
	});

	it("can get schema with nested object path fields", async () => {
		const schema = getInstance();
		const info   = await schema.getSchema({handleNestedObjects : true});

		expect(info).toBeDefined();

		const parent = info.tables.account.getField("subThing");
		expect(parent).toBeDefined();
		expect(parent.type).toBe("object");
		expect(parent.children.length).toBe(1);
		expect(parent.children[0].children.length).toBe(1);
	});

	it("can get schema with nested object path fields & delete originals", async () => {
		const schema = getInstance();
		const info   = await schema.getSchema({handleNestedObjects : true, deleteOriginalNestedObjectFields : true});

		expect(info).toBeDefined();

		const parent = info.tables.account.getField("subThing");
		expect(parent).toBeDefined();
		expect(parent.type).toBe("object");
		expect(parent.children.length).toBe(1);
		expect(parent.children[0].children.length).toBe(1);

		expect(info.tables.account.getField("subThing.data")).toBeUndefined();
		expect(info.tables.account.getField("subThing.data.key")).toBeUndefined();
	});

	it("can get schema with generated id field", async () => {
		const schema = getInstance();
		const info   = await schema.getSchema({generateId : true});

		expect(info).toBeDefined();
		expect(Object.values(info.tables).every(f => f.fields.id !== undefined)).toBeTruthy();
	});

	it("can generate original schema", async () => {
		const schema     = getInstance();
		const info       = await schema.getSchema();
		const schemaText = info.getFullSchema();

		expect(info).toBeDefined();
		expect(schemaText).toBeDefined();
		expect(schemaText.length > 0).toBe(true);
		expect(schemaText).toContain("DEFINE TABLE account");
		expect(schemaText).toContain("DEFINE TABLE profile");
		expect(schemaText).toContain("DEFINE FIELD profiles");


	});
});
