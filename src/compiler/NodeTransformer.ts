import type { Node } from "../parser/types.js";

export class NodeTransformer<NodeType extends string, AnyNode extends Node<any>> {

  new<T extends NodeType>(
    type: T,
    props: Omit<Extract<AnyNode, { type: T; }>, "type">
  ): Extract<AnyNode, { type: T; }> {
    return {
      type,
      ...props
    } as Extract<AnyNode, { type: T; }>;
  }

  read<T extends NodeType>(source: string, as?: T): Extract<AnyNode, { type: T; }> {
    throw "Function read not implemented";
  }
}
