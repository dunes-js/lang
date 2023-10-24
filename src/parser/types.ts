import type { TokenAnalyzer } from "./Analyzer.js"

export interface Node<T extends PropertyKey> {
	type: T
}

export interface LookAhead<Ta extends TokenAnalyzer<string, string>, X> {
  (tokens: Ta): X
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

