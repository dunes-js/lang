import type { 
  ASTOptions,
  Node, 
  ParseOptions, 
} from "./types.js";
import { Program } from "./Program.js";


export class AST<
  AnyNode extends Node<any>, 
  P extends ASTOptions
> {
	readonly program: (
   & Program<AnyNode, P["programProps"]> 
   & P["programProps"] 
  );
	constructor(public options?: ParseOptions<P["programProps"]>) {
		this.program = new Program(options?.program || {});
	}
}



