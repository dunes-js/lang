import type { Node } from "../parser/types.js";



export class PathNode<NodeType extends string, AnyNode extends Node<any>> {
  constructor(
    readonly node: Extract<AnyNode, { type: NodeType; }>
  ) {}
  remove(): void {}
  replaceWith(node: AnyNode): void {}
}
