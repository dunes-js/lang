import { type TType, Token, TokenList, Lexer } from "../lexer/index.js";
import { AST } from "./AST.js";
import type { Node, LookAhead, ParseOptions, ParserOptions } from "./types.js";

class ParserError extends Error {
	constructor(tokens: TokenList<any>, err: unknown) {
		const token = tokens[0]!;
		const {line, column} = token.first();
		super(`${line}:${column}\nUnexpected token "${token.type}", ${err}`);
	}
}

export abstract class Parser<
	TokenType extends string, 
  AnyNode extends Node<any>,
  const Options extends ParserOptions
> {

	#lexer: Lexer<TokenType>
	constructor(lexer: Lexer<TokenType>) {
		this.#lexer = lexer;
	}

	body: AnyNode[] = [];
	#tokens!: TokenList<TokenType>
  #ast!: AST<AnyNode, Options["ast"]>

	produce(source: string, options?: ParseOptions<Options["ast"]>): AST<AnyNode, Options["ast"]> {

		this.#ast = new AST<AnyNode, Options["ast"]>(options);
		this.#tokens = this.#lexer.convert(source);

    this.onLoad?.();

		while (this.willContinue()) {
			try {
				const p = this.parse() as AnyNode;
				this.body.push(p);
				this.#ast.program.body.push(p);
			}
			catch(error) {
				throw new ParserError(this.#tokens, error);
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
    this.#ast.program.props[propName] = value;
  }

  protected hasProperty<
    PropName extends keyof Options["ast"]["programProps"]>(
      propName: PropName,
    ) {
    return this.#ast.program.props[propName] != undefined;
  }

	protected willContinue() {
		return this.#tokens[0]?.type !== "EOF";
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

  protected lookAhead<X>(look: LookAhead<TokenType, X>) {
    return look(new TokenList(...this.#tokens));
  }

	protected eat<Ty extends TType<TokenType>>(): Token<Ty> {
		return this.#tokens.shift() as Token<Ty>;
	}

	protected type(): TType<TokenType> {
		return this.#tokens[0]!.type;
	}

	protected if<Ty extends TType<TokenType>>(type: TType<Ty>): Token<Ty> | null {
		if (type === this.#tokens[0]!.type) {
			return this.#tokens.shift() as Token<Ty>;
		}
		return null;
	}

	protected is(type: TType<TokenType>): boolean {
		return type === this.#tokens[0]!.type;
	}

	protected isnt(type: TType<TokenType>): boolean {
		return type !== this.#tokens[0]!.type;
	}

	protected isAny(...types: TType<TokenType>[]): boolean {
		return types.includes(this.#tokens[0]!.type);
	}

  protected isntAny(...types: TType<TokenType>[]): boolean {
    return !types.includes(this.#tokens[0]!.type);
  }

	protected expect<Ty extends TType<TokenType>>(type: Ty, error: string): Token<Ty> {
		if (this.#tokens[0]!.type !== type) {
			throw error;
		}
		return this.#tokens.shift()! as Token<Ty>;
	}

}