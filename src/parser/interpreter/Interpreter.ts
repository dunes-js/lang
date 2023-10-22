import type { Node, ParserOptions } from "../parser/types.js";
import type { Value } from "./types.js";
import type { AST } from "../parser/AST.js";
import type { Environment } from "./Environment.js";



export abstract class Int<
  AnyValue extends Value<any>,
  AnyNode extends Node<any>,
  const Options extends ParserOptions
> {

  constructor() {}

  public interpret(ast: AST<AnyNode, Options["ast"]>): AnyValue {
    let lastEvaluated = this.emptyValue();
    const globalEnv = this.globalEnvironment();
    for (const node of ast.program.body) {
      lastEvaluated = this.evaluate(node, globalEnv);
    }
    return lastEvaluated;
  }

  abstract globalEnvironment(): Environment<AnyValue>;
  abstract emptyValue(): AnyValue;
  abstract evaluate(node: AnyNode, env: Environment<AnyValue>): AnyValue;


  protected new<T extends AnyValue["type"]>(
    type: T,
    props: Omit<Extract<AnyValue, { type: T; }>, "type">
  ): Extract<AnyValue, { type: T; }> {
    return {
      type,
      ...props
    } as Extract<AnyValue, { type: T; }>;
  }
}
