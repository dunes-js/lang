import type { TokenAnalyzer } from "./Analyzer.js"

export interface Node<T extends PropertyKey> {
	type: T
}

export interface LookAhead<Type extends string, Tag extends string, X> {
  (tokens: TokenAnalyzer<Type, Tag>): X
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

