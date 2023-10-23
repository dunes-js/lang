import { Token } from "../lexer/Token.js";
import type { TagType, TknType, TokenList } from "../lexer/types.js";
import type { LookAhead } from "./types.js";

export class TokenAnalyzer<
  Type extends string, 
  Tag extends string = string, 
> {

  #tokens!: TokenList<Type, Tag>;
  constructor(tokens: TokenList<Type, Tag> = []) {
    this.tokens = tokens;
  }

  get tokens() {
    return this.#tokens;
  }

  set tokens(tokens: TokenList<Type, Tag>) {
    this.#tokens = [...tokens];
  }

  willContinue() {
    return this.#tokens[0]?.type !== "EOF";
  }
  
  lookAhead<X>(look: LookAhead<Type, Tag, X>) {
    return look(new TokenAnalyzer(this.#tokens));
  }

  eat<Ty extends TknType<Type>>(): Token<Ty, Tag> {
    return this.#tokens.shift() as Token<Ty, Tag>;
  }

  type(): TknType<Type> {
    return this.#tokens[0]!.type;
  }

  has(tag: TagType<Tag>): boolean {
    return this.#tokens[0]!.has(tag)
  }

  if<Ty extends TknType<Type>>(type: TknType<Ty>): Token<Ty, Tag> | null {
    if (type === this.#tokens[0]!.type) {
      return this.#tokens.shift() as Token<Ty, Tag>;
    }
    return null;
  }
  is(type: TknType<Type>): boolean {
    return type === this.#tokens[0]!.type;
  }

  isnt(type: TknType<Type>): boolean {
    return type !== this.#tokens[0]!.type;
  }

  isAny(...types: TknType<Type>[]): boolean {
    return types.includes(this.#tokens[0]!.type);
  }

  isntAny(...types: TknType<Type>[]): boolean {
    return !types.includes(this.#tokens[0]!.type);
  }

  expect<Ty extends TknType<Type>>(type: Ty, error: string): Token<Ty, Tag> {
    if (this.#tokens[0]!.type !== type) {
      throw error;
    }
    return this.#tokens.shift()! as Token<Ty, Tag>;
  }

  expectTag<Ty extends TagType<Tag>>(tag: Ty, error: string): Token<Ty, Tag> {
    if (this.#tokens[0]!.has(tag)) {
      return this.#tokens.shift()! as Token<Ty, Tag>;
    }
    throw error;
  }

  trim() {
    while (this.willContinue() && this.has("WhiteSpace")) this.eat();
  }

  eatTrim() {
    this.eat();
    this.trim()
  }


}