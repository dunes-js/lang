import type { Prom } from "@dunes/tools"
import type { NodeTransformer } from "./NodeTransformer.js"
import type { PathNode } from "./PathNode.js"
import type { Node } from "../parser/types.js"

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

export type ConvertOptions = {}

