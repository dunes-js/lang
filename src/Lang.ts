import type { Int } from "./interpreter/Interpreter.js";
import type { Value } from "./interpreter/types.js";
import type { Lex } from "./lexer/Lexer.js";
import type { AST } from "./parser/AST.js";
import type { Par } from "./parser/Parser.js";
import type { Node, ParseOptions, ParserOptions } from "./parser/types.js";




export class Lang<
  TokenType extends string,
  AnyNode extends Node<any>,
  const Options extends ParserOptions,
  TokenTag extends string = string,
  AnyValue extends Value<any> = Value<any>,
> {

  constructor(
    readonly lexer: Lex<TokenType, TokenTag>,
    readonly parser: Par<TokenType, AnyNode, Options, TokenTag>,
    readonly interpreter: Int<AnyValue, AnyNode, Options> | null = null
  ) {}

  #ast(source: string, options?: ParseOptions<Options["ast"]>): AST<AnyNode, Options["ast"]> {
    return this.parser.produce(this.lexer.convert(source), options)
  }

  parse(source: string): AST<AnyNode, Options["ast"]> {
    return this.#ast(source);
  }

  interpret(source: string): AnyValue {
    if (!this.interpreter) {
      throw `No interpreter has been declared`
    }
    return this.interpreter.interpret(this.#ast(source));
  }
}