import type { TokenList } from "../lexer/Token.js"

export interface Node<T extends PropertyKey> {
	type: T
}

export interface LookAhead<T extends string, X> {
  (tokens: TokenList<T>): X
}

export type ParseOptions<Opts extends ProgramProps> = {
  program?: Partial<Opts>
}


export type ParserOptions = {
  ast: ASTOptions
}

export type ASTOptions = {
  programProps: ProgramProps
}

export type ProgramProps = {
  [key: string]: any
}

