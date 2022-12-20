import {describe, it, expect} from "vitest";
import {SchemaParser, SchemaField} from "../src";

describe("Parser", () => {

	it("can parse different field definitions", () => {
		const fields = [
			{
				schema : `DEFINE FIELD name ON organisation TYPE string VALUE string::slug($value) && string::words($value) ASSERT $value != NONE PERMISSIONS FOR select, update FULL;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("name");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value != NONE");
					expect(field.hasValueStatement()).toBe(true);
					expect(field.value).toBe("string::slug($value) && string::words($value)");
					expect(field.hasPermissionsStatement()).toBe(true);
					expect(field.permissions).toBe("FOR select, update FULL");
				},
			},
			{
				schema : `DEFINE FIELD name ON organisation TYPE string ASSERT $value != NONE;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("name");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value != NONE");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD description ON TABLE organisation TYPE string;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("description");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(false);
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD website ON TABLE organisation TYPE string;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("website");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(false);
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD email ON TABLE organistion TYPE string ASSERT is::email($value);`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("email");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organistion");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("is::email($value)");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD manager_roles ON TABLE organisation TYPE array;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("manager_roles");
					expect(field.type).toBe("array");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(false);
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD manager_roles.* ON TABLE organisation TYPE object ASSERT $value != NONE;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("manager_roles.*");
					expect(field.type).toBe("object");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value != NONE");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD manager_roles.*.id ON TABLE organisation TYPE string ASSERT $value = /^manager:.*/;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("manager_roles.*.id");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value = /^manager:.*/");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD manager_roles.*.role ON TABLE organisation TYPE string ASSERT $value = 'owner' OR $value = 'administrator' OR $value = 'event_manager' OR $value = 'event_viewer';`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("manager_roles.*.role");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value = 'owner' OR $value = 'administrator' OR $value = 'event_manager' OR $value = 'event_viewer'");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD master_organisation ON TABLE organisation TYPE string ASSERT $value = /^organisation:.*/ OR $value = NONE;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("master_organisation");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value = /^organisation:.*/ OR $value = NONE");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD name ON TABLE organisation TYPE string ASSERT $value != NONE;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("name");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value != NONE");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD users ON TABLE organisation TYPE array;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("users");
					expect(field.type).toBe("array");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(false);
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD users.* ON TABLE organisation TYPE record (user);`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("users.*");
					expect(field.type).toBe("record");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(false);
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD type ON TABLE organisation TYPE array ASSERT array::len($value) != 0;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("type");
					expect(field.type).toBe("array");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("array::len($value) != 0");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD type.* ON TABLE organisation TYPE string ASSERT $value INSIDE ["customer", "vendor", "admin"];`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("type.*");
					expect(field.type).toBe("string");
					expect(field.table).toBe("organisation");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value INSIDE [\"customer\", \"vendor\", \"admin\"]");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD name ON TABLE department TYPE string ASSERT $value != NONE;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("name");
					expect(field.type).toBe("string");
					expect(field.table).toBe("department");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value != NONE");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD name ON TABLE location TYPE string ASSERT $value != NONE;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("name");
					expect(field.type).toBe("string");
					expect(field.table).toBe("location");
					expect(field.hasAssertStatement()).toBe(true);
					expect(field.assert).toBe("$value != NONE");
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD departments ON TABLE location TYPE array;`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("departments");
					expect(field.type).toBe("array");
					expect(field.table).toBe("location");
					expect(field.hasAssertStatement()).toBe(false);
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
			{
				schema : `DEFINE FIELD departments.* ON TABLE location TYPE record (department);`,
				test   : (fieldDef: string, field: SchemaField) => {
					expect(field.name).toBe("departments.*");
					expect(field.type).toBe("record");
					expect(field.table).toBe("location");
					expect(field.hasAssertStatement()).toBe(false);
					expect(field.hasValueStatement()).toBe(false);
					expect(field.hasPermissionsStatement()).toBe(false);
				},
			},
		];

		for (let {schema, test} of fields) {
			const result = SchemaParser.parseField(schema);
			expect(result).toBeDefined();

			test(schema, result);
		}

	});

});
