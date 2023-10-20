import type { 
    ASTOptions,
  AsyncTraveler, 
  ConvertOptions, 
  Node, 
  ParseOptions, 
  Traveler 
} from "./types.js";
import { Program } from "./Program.js";


export class AST<
  AnyNode extends Node<any>, 
  P extends ASTOptions
> {
	program: Program<AnyNode, P["programProps"]>
	constructor(public options?: ParseOptions<P>) {
		this.program = new Program();

    if (options?.program) for (const key in options.program) {
      this.program.props[key] = options.program[key]!;
    }
	}

  travel(travel: Traveler<AnyNode>): void {
    throw "Function travel not implemented";
  }

  travelAsync(travel: AsyncTraveler<AnyNode>): Promise<void> {
    throw "Function travelAsync not implemented";
  }

  convert(options?: ConvertOptions): string {
    throw "Function convert not implemented";
  }
  async convertAsync(options?: ConvertOptions): Promise<string> {
    throw "Function convertAsync not implemented";
  }
}



