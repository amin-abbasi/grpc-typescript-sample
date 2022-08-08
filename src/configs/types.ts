export interface IEnvironmentModel {
  readonly NODE_ENV : string
  readonly APP_ENV  : string
  readonly SERVER_HOST : string
  readonly SERVER_PORT : number
  readonly DB_HOST  : string
  readonly DB_USER? : string
  readonly DB_PASS? : string
  readonly DB_PORT  : number
  readonly DB_NAME  : string
}

export interface IType {
  [key: string]: string
}

export interface IRegex {
  [key: string]: RegExp
}

export interface IConfigModel {
  readonly env       : IEnvironmentModel
  readonly sortTypes : IType
  readonly regex     : IRegex
  readonly maxPageSizeLimit : number
}
