import type { Prom } from "@dunes/tools"
import type { TokenList } from "../lexer/Token.js"
import type { NodeTransformer } from "./NodeTransformer.js"
import type { PathNode } from "./PathNode.js"

export interface Node<T extends PropertyKey> {
	type: T
}

export interface LookAhead<T extends string, X> {
  (tokens: TokenList<T>): X
}

export type ParseOptions<Opts extends ASTOptions> = {
  program?: Partial<Opts["programProps"]>
}

export type ConvertOptions = {}

export type TravelerNode<Type extends string, AnyNode extends Node<any>> = 
  (path: PathNode<Type, AnyNode>) => any

export type AsyncTravelerNode<Type extends string, AnyNode extends Node<any>> = 
  (path: PathNode<Type, AnyNode>) => Prom<any>


export type Traveler<AnyNode extends Node<any>> = {
  (tr: NodeTransformer<AnyNode["type"], AnyNode>): {
    [Type in AnyNode["type"]]?: TravelerNode<Type, AnyNode>;
  }
}

export type AsyncTraveler<AnyNode extends Node<any>> = {
  (tr: NodeTransformer<AnyNode["type"], AnyNode>): {
    [Type in AnyNode["type"]]?: AsyncTravelerNode<Type, AnyNode>;
  }
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

