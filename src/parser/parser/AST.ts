import type { Node, Program } from "./types.js";


export class AST<NodeType extends string, AnyNode extends Node<any>> {
	program: Program<AnyNode>
	constructor() {
		this.program = {
			type: "Program", 
			body: []
		}
	}

	json(i = 2): string {
		return JSON.stringify(this.program, null, i);
	}

  travel(travel: Traveler<NodeType, AnyNode>) {
    // return traveler()
    throw "Not"
  }
}


type TravelerNode<NodeType extends string, AnyNode extends Node<any>> = 
  (path: PathNode<NodeType, AnyNode>) => any


class PathNode<NodeType extends string, AnyNode extends Node<any>> {
  constructor(
    readonly node: Extract<AnyNode, {type: NodeType}>
  ) {}
  remove(): void {}
  replaceWith(node: AnyNode): void {}
}

class NodeTransformer<NodeType extends string, AnyNode extends Node<any>> {

  new<T extends NodeType>(
    type: T, 
    props: Omit<Extract<AnyNode, {type: T}>, "type">
  ): Extract<AnyNode, {type: T}> {
    return {
      type,
      ...props
    } as Extract<AnyNode, {type: T}>
  }

  read<T extends NodeType>(source: string, as?: T): Extract<AnyNode, {type: T}> {
    throw "Function read not implemented"
  }
}

export type Traveler<NodeType extends string, AnyNode extends Node<any>> = {
  (tr: NodeTransformer<NodeType, AnyNode>): {
    [K in NodeType]?: TravelerNode<K, AnyNode>;
  }
}