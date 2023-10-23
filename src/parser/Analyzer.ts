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

  type(i = 0): TknType<Type> {
    return this.#tokens[i]!.type;
  }

  has(tag: TagType<Tag>, i = 0): boolean {
    return this.#tokens[i]!.has(tag)
  }

  if<Ty extends TknType<Type>>(type: TknType<Ty>, i = 0): Token<Ty, Tag> | null {
    if (type === this.#tokens[i]!.type) {
      return this.#tokens.shift() as Token<Ty, Tag>;
    }
    return null;
  }
  is(type: TknType<Type>, i = 0): boolean {
    return type === this.#tokens[i]!.type;
  }

  isnt(type: TknType<Type>, i = 0): boolean {
    return type !== this.#tokens[i]!.type;
  }

  isAny(...types: TknType<Type>[]): boolean {
    return types.includes(this.#tokens[0]!.type);
  }

  isntAny(...types: TknType<Type>[]): boolean {
    return !types.includes(this.#tokens[0]!.type);
  }

  isAnyAt(types: TknType<Type>[], i = 0): boolean {
    return types.includes(this.#tokens[i]!.type);
  }

  isntAnyAt(types: TknType<Type>[], i = 0): boolean {
    return !types.includes(this.#tokens[i]!.type);
  }

  expect<Ty extends TknType<Type>>(type: Ty, error: string, i = 0): Token<Ty, Tag> {
    if (this.#tokens[i]!.type !== type) {
      throw error;
    }
    return this.#tokens.shift()! as Token<Ty, Tag>;
  }

  expectAny<Ty extends TknType<Type>>(types: Ty[], error: string, i = 0): Token<Ty, Tag> {
    if (this.#tokens[i]!.includes(types)) {
      throw error;
    }
    return this.#tokens.shift()! as Token<Ty, Tag>;
  }

  expectTag<Ta extends TagType<Tag>>(tag: Ta, error: string, i = 0): Token<Type, Ta> {
    if (this.#tokens[i]!.has(tag)) {
      return this.#tokens.shift()! as Token<Type, Ta>;
    }
    throw error;
  }

  expectAnyTag<Ta extends TagType<Tag>>(tags: Ta[], error: string, i = 0): Token<Type, Ta> {
    if (this.#tokens[i]!.includes(tags)) {
      return this.#tokens.shift()! as Token<Type, Ta>;
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