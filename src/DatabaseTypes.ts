export enum DatabaseFieldTypes {
	ANY      = "any",
	ARRAY    = "array",
	BOOL     = "bool",
	DATETIME = "datetime",
	DECIMAL  = "decimal",
	DURATION = "duration",
	FLOAT    = "float",
	INT      = "int",
	NUMBER   = "number",
	OBJECT   = "object",
	STRING   = "string",
	RECORD   = "record",
	GEOMETRY = "geometry",
}



export type DbResponse<T> = T[];

export type DbResponseResult<T> = {
	time: string,
	status: string,
	result: T;
}

export type DbInfo = {
	dl: any;
	dt: any;
	sc: any;
	tb: { [name: string]: string };
}

export class DbInfoResponse {

	public originalResponse: DbResponseResult<DbInfo>;

	public logins: { [name: string]: string } = {};
	public tokens: { [name: string]: string } = {};
	public scopes: { [name: string]: string } = {};
	public tables: { [name: string]: string } = {};

	public static fromJson(json: DbResponseResult<DbInfo>): DbInfoResponse {
		const data            = new DbInfoResponse();
		data.originalResponse = json;

		data.logins = json.result.dl;
		data.tokens = json.result.dt;
		data.scopes = json.result.sc;
		data.tables = json.result.tb;

		return data;
	}

	public getTableNames(): string[] {
		return Object.keys(this.tables);
	}
}

export type TableInfo = {
	ev: any;
	fd: { [name: string]: string };
	ft: any;
	ix: any;
}


export class DbTableResponse {

	public originalResponse: DbResponseResult<TableInfo>;

	public events: { [name: string]: string }  = {};
	public fields: { [name: string]: string }  = {};
	public indexes: { [name: string]: string } = {};
	public foreign: { [name: string]: string } = {};

	public static fromJson(json: DbResponseResult<TableInfo>): DbTableResponse {
		const data            = new DbTableResponse();
		data.originalResponse = json;

		data.events  = json.result.ev;
		data.fields  = json.result.fd;
		data.indexes = json.result.ix;
		data.foreign = json.result.ft;

		return data;
	}
}

