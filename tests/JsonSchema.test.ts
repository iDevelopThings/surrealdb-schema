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

describe("JsonSchema", () => {

	it("can create json schema", async () => {
		const s = getInstance();

		await s.getSchema();

		const schema = await s.getJsonSchema();
	});

});
