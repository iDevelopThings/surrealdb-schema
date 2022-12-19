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

		expect(info).toBeDefined();
		expect(info.tables.account).toBeDefined();
		expect(info.tables.profile).toBeDefined();
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
