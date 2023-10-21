
import type { Node, ProgramProps } from "../parser/types.js";
import { Program } from "../parser/Program.js";


export class Interpreter<
  AnyNode extends Node<any>, 
  P extends ProgramProps
> {
  constructor(readonly program: (
   & Program<AnyNode, P> 
   & P 
  )) {}
}

