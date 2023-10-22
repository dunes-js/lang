import type { Node, ProgramProps } from "./types.js";

export class Program<
  N extends Node<any>, 
  P extends ProgramProps
> implements Node<"Program"> {
  readonly type = "Program";
  readonly body: N[] = [];
  readonly[key: string]: any
  constructor(props: P) {
    for (const prop in props) {
      if (!(prop in this)) this[prop] = props[prop]!;
    }
  }
  
  add(node: N): void {
    this.body.push(node);
  }

  json(i = 2): string {
    return JSON.stringify(this, null, i);
  }
}