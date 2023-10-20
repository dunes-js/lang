import { type TType, Token, TokenList, Lexer } from "../lexer/index.js";
import { AST } from "./AST.js";
import type { Node, LookAhead } from "./types.js";

class ParserError extends Error {
	constructor(tokens: TokenList<any>, err: unknown) {
		const token = tokens[0]!;
		const {line, column} = token.first();
		super(`${line}:${column}\nUnexpected token "${token.type}", ${err}`);
	}
}

export abstract class Parser<
	TokenType extends string, 
  NodeType extends string,
  AnyNode extends Node<NodeType>
> {

	#lexer: Lexer<TokenType>
	constructor(lexer: Lexer<TokenType>) {
		this.#lexer = lexer;
	}

	body: AnyNode[] = [];
	#tokens!: TokenList<TokenType>

	produce(source: string): AST<NodeType, AnyNode> {

		const ast = new AST<NodeType, AnyNode>();
		this.#tokens = this.#lexer.convert(source);

		while (this.willContinue()) {
			try {
				const p = this.parse() as AnyNode;
				this.body.push(p);
				ast.program.body.push(p);
			}
			catch(error) {
				throw new ParserError(this.#tokens, error);
			}
		}

		return ast;
	}

	protected abstract parse(): Node<NodeType>

	protected willContinue() {
		return this.#tokens[0]?.type !== "EOF";
	}

	protected new<T extends NodeType>(
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