import {type TokenList } from "../lexer/index.js";
import { AST } from "./AST.js";
import { TokenAnalyzer } from "./Analyzer.js";
import type { Node, ParseOptions, ParserOptions } from "./types.js";


export abstract class Par<
	TokenType extends string, 
  AnyNode extends Node<any>,
  const Options extends ParserOptions,
  TokenTag extends string = string, 
> extends TokenAnalyzer<TokenType, TokenTag> {

  #ast!: AST<AnyNode, Options["ast"]>

	produce(tokens: TokenList<TokenType, TokenTag>, options?: ParseOptions<Options["ast"]>): AST<AnyNode, Options["ast"]> {
		this.#ast = new AST<AnyNode, Options["ast"]>(options);
    this.tokens = tokens;
    this.onLoad?.();

		while (this.willContinue()) {
			try {
				const p = this.parse() as AnyNode;
				this.#ast.program.add(p);
			}
			catch(error) {
				throw new ParserError(this.tokens, error);
			}
		}

		return this.#ast;
	}

	protected abstract parse(): Node<AnyNode["type"]>;
  
  protected onLoad?(): void;

  protected setProperty<
    PropName extends keyof Options["ast"]["programProps"]>(
      propName: PropName, 
      value: Options["ast"]["programProps"][PropName]
    ) {
    this.#ast.program[propName] = value!;
  }

  protected hasProperty<
    PropName extends keyof Options["ast"]["programProps"]>(
      propName: PropName,
    ) {
    return this.#ast.program[propName] != undefined;
  }

	protected new<T extends AnyNode["type"]>(
		type: T, 
		props: Omit<Extract<AnyNode, {type: T}>, "type">
	): Extract<AnyNode, {type: T}>
	{
		return {
			type,
			...props
		} as Extract<AnyNode, {type: T}>
	}


}


class ParserError extends Error {
  constructor(tokens: TokenList<any, any>, err: unknown) {
    const token = tokens[0]!;
    const {line, column} = token.first();
    super(`${line}:${column}\nUnexpected token "${token.type}", ${err}`);
  }
}