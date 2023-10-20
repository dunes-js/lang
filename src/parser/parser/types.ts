import type { TokenList } from "../lexer/Token.js"

export interface Node<T extends PropertyKey> {
	type: T
}

export interface Program<N extends Node<any>> extends Node<"Program"> {
	body: N[]
}

export interface LookAhead<T extends string, X> {
  (tokens: TokenList<T>): X
}
