import type { TokenList } from "../lexer/Token.js"
import type { NodeList } from "./AST.js"

export interface NodeDecl {
	[key: string]: any
}

export interface NodesObj {
	[key: string]: NodeDecl
}

export interface Node<T extends PropertyKey> {
	type: T
}

export interface Program<Nodes extends NodesObj> extends Node<"Program"> {
	body: NodeList<Nodes>
}

export interface LookAhead<T extends string, X> {
  (tokens: TokenList<T>): X
}
