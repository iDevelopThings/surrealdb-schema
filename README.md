<br>

<p align="center">
    <a href="https://surrealdb.com#gh-dark-mode-only" target="_blank">
        <img width="300" src="https://raw.githubusercontent.com/surrealdb/surrealdb/bcac94f9d6ee154fd6ec2b5c0c910525b0c23b7a/img/white/logo.svg" alt="SurrealDB Logo">
    </a>
    <a href="https://surrealdb.com#gh-light-mode-only" target="_blank">
        <img width="300" src="https://raw.githubusercontent.com/surrealdb/surrealdb/bcac94f9d6ee154fd6ec2b5c0c910525b0c23b7a/img/black/logo.svg" alt="SurrealDB Logo">
    </a>
</p>



<h2>SurrealDB Schema</h2>

## Description
This package provides functionality for parsing SurrealDB schema information from the database API, it then proves classes/structure for those parsed definitions.

## Installation
To install this package, run the following command in your project directory:
```bash
npm install surrealdb.schema
yarn add surrealdb.schema
```

## Usage
Here is an example of how to use this package to parse your database schema:

```typescript
import {SurrealSchema} from 'surreal.schema';

const surrealSchema = SurrealSchema.init({
	host      : "http://127.0.0.1:8000",
	user      : "root",
	pass      : "secret",
	namespace : "test",
	database  : "test",
});

await surrealSchema.getSchema(); // Returns `Schema` instance

// There is also:
await surrealSchema.getDbInfo();
await surrealSchema.getTableInfo("table name");
await surrealSchema.getTablesInfo(["one", "two"]);
```

### Schema:

```typescript
interface ISchema {
	tables: { [name: string]: SchemaTable };
	hasTable(name: string): boolean;
	getTable(name: string): SchemaTable;
	getTables(): SchemaTable[];
	getTableNames(): string[];
	getFullSchema(): string;
}
```

### Table
```typescript
interface ISchemaTable {
	originalString: string;
	name: string;
	title: string;
	fields: { [name: string]: SchemaField };
	hasField(name: string): boolean;
	getField(name: string): SchemaField;
	getFieldNames(): string[];
	getFields(): SchemaField[];
	getFullSchema(): string;
}
```

### Field
```typescript
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
}
```

## Contributing
We welcome contributions to this package! If you have an idea for a new feature or a bug fix, please open an issue or submit a pull request.

## License
This package is licensed under the [MIT License](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt).
