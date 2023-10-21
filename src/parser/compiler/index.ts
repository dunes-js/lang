
import type { 
  AsyncTraveler, 
  ConvertOptions, 
  Traveler 
} from "./types.js";
import type { Node, ProgramProps } from "../parser/types.js";
import { Program } from "../parser/Program.js";


export class Compiler<
  AnyNode extends Node<any>, 
  P extends ProgramProps
> {
  constructor(readonly program: (
   & Program<AnyNode, P> 
   & P 
  )) {}

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

