import { Char, CharList } from "./Char.js";
import { Token, TokenList } from "./Token.js";
import type { TknType, TagType } from "./types.js";

export abstract class Lex<
  Type extends string,
  Tag extends string = string
> {

	#chars!: CharList

	convert(source: string): TokenList<Type, Tag> {
		this.#chars = new CharList(source);
		const tokens = new TokenList<Type, Tag>();
		while (this.#chars.length) {
			const token = this.read();
			if (token)
				tokens.push(token);
		}
		tokens.push(this.new("EOF", "$$EOF$$" as unknown as Char));
		return tokens;
	}

	protected abstract read(): Token<TknType<Type>, TagType<Tag>> | null;

	protected new(type: TknType<Type>, ...chars: Char[]): Token<TknType<Type>, TagType<Tag>> {
		return new Token(type, ...chars)
	}

	protected finished(): boolean {
		return this.#chars.length <= 0;
	}

	protected eat(): Char {
		return this.#chars.shift()!;
	}

	protected is(str: string, n = 0): boolean {
		return this.#chars[n]!.value === str;
	}

	protected value(n = 0): string {
		return this.#chars[n]!.value;
	}

	protected match(reg: RegExp, n = 0): boolean {
		return reg.test(this.#chars[n]!.value);
	}

	protected equal(str: string): boolean {
		return this.#chars[0]!.value === str;
	}

	protected isLetter(): boolean {
		const x = this.#chars[0]!.value;
		return x.toUpperCase() !== x.toLowerCase();
	}

}