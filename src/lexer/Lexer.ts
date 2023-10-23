import { Char, CharList } from "./Char.js";
import { Token, TokenList } from "./Token.js";
import type { TknType, TagType } from "./types.js";

/**
 * Abstract class for converting source to token list
 */
export abstract class Lex<
  Type extends string,
  Tag extends string = string
> {

	#chars!: CharList

  /**
   * Convert string to TokenList
   */
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

  /**
   * Create a new Token
   */
	protected new(type: TknType<Type>, ...chars: Char[]): Token<TknType<Type>, TagType<Tag>> {
		return new Token(type, ...chars)
	}

  /**
   * @deprecated
   * Use `willContinue`
   */
	protected finished(): boolean {
		return this.#chars.length <= 0;
	}

  /**
   * Whether there are `Char`s left
   */
  protected willContinue(): boolean {
    return this.#chars.length > 0;
  }

  /**
   * Get current `Char`
   */
	protected eat(): Char {
		return this.#chars.shift()!;
	}

  /**
   * Check if `Char` is string
   */
	protected is(str: string, n = 0): boolean {
		return this.#chars[n]!.value === str;
	}

  /**
   * Get current `Char` value
   */
	protected value(n = 0): string {
		return this.#chars[n]!.value;
	}

  /**
   * Check if `Char` matches regex
   */
	protected match(reg: RegExp, n = 0): boolean {
		return reg.test(this.#chars[n]!.value);
	}

  /**
   * @deprecated
   * Use `is`
   */
	protected equal(str: string): boolean {
		return this.#chars[0]!.value === str;
	}

  /**
   * Check if `Char` is a letter
   */
	protected isLetter(): boolean {
		const x = this.#chars[0]!.value;
		return x.toUpperCase() !== x.toLowerCase();
	}

}