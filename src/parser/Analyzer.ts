import { Token } from "../lexer/Token.js";
import type { TagType, TknType, TokenList } from "../lexer/types.js";
import type { LookAhead } from "./types.js";

export class TokenAnalyzer<
  Type extends string, 
  Tag extends string = string, 
> {

  accessor tokens: TokenList<Type, Tag>;
  constructor(tokens: TokenList<Type, Tag> = []) {
    this.tokens = tokens;
  }

  protected willContinue() {
    return this.tokens[0]?.type !== "EOF";
  }
  
  protected lookAhead<X>(look: LookAhead<Type, Tag, X>) {
    return look(new TokenAnalyzer(this.tokens));
  }

  protected eat<Ty extends TknType<Type>>(): Token<Ty, Tag> {
    return this.tokens.shift() as Token<Ty, Tag>;
  }

  protected type(): TknType<Type> {
    return this.tokens[0]!.type;
  }

  protected has(tag: TagType<Tag>): boolean {
    return this.tokens[0]!.has(tag)
  }

  protected if<Ty extends TknType<Type>>(type: TknType<Ty>): Token<Ty, Tag> | null {
    if (type === this.tokens[0]!.type) {
      return this.tokens.shift() as Token<Ty, Tag>;
    }
    return null;
  }
  protected is(type: TknType<Type>): boolean {
    return type === this.tokens[0]!.type;
  }

  protected isnt(type: TknType<Type>): boolean {
    return type !== this.tokens[0]!.type;
  }

  protected isAny(...types: TknType<Type>[]): boolean {
    return types.includes(this.tokens[0]!.type);
  }

  protected isntAny(...types: TknType<Type>[]): boolean {
    return !types.includes(this.tokens[0]!.type);
  }

  protected expect<Ty extends TknType<Type>>(type: Ty, error: string): Token<Ty, Tag> {
    if (this.tokens[0]!.type !== type) {
      throw error;
    }
    return this.tokens.shift()! as Token<Ty, Tag>;
  }

  protected expectTag<Ty extends TagType<Tag>>(tag: Ty, error: string): Token<Ty, Tag> {
    if (this.tokens[0]!.has(tag)) {
      return this.tokens.shift()! as Token<Ty, Tag>;
    }
    throw error;
  }

  protected trim() {
    while (this.willContinue() && this.has("WhiteSpace")) this.eat();
  }

  protected eatTrim() {
    this.eat();
    this.trim()
  }


}