import type { Recommend } from "@dunes/tools";
import type { Char } from "./Char.js";
import type { TType } from "./types.js";

export class Token<
  Type extends string, 
  Tag extends string = string
> {
	#value: TokenValue
  public type: Type
  readonly #tags: Tag[] = [];
  constructor(type: Type, ...chars: Char[]) 
  {
    this.type = type;
		this.#value = new TokenValue(chars);
	}

  setTag(tag: Tag): void {
    this.#tags.push(tag);
  }

	get value(): string {
		return String(this.#value);
	}

	first(): Char {
		return this.#value.chars[0]!
	}

	last(): Char {
		return this.#value.chars[this.#value.chars.length - 1]!
	}

  has(tag: Recommend<Tag>): boolean {
    return this.#tags.includes(tag as Tag);
  }
}

/*->
macro lastItem<T>(arr: T[]): T {
	return arr[arr.length - 1];
}

// index.pts
const myArray = [1, 2, 3, 4];
const last = lastItem(myArray);


// index.js
const myArray = [1, 2, 3, 4];
const last = myArray[myArray.length - 1]

*/


class TokenValue extends String {
	readonly chars: Char[]
	constructor(chars: Char[]) {
		if (!chars.length) 
			throw "Empty chars in TokenValue";
		if (chars[0] as unknown as string === "$$EOF$$") 
			super();
		else 
			super(chars.map(({value}) => value).join(""));
		this.chars = chars;
	}

}

export class TokenList<
  Type extends string, 
  Tag extends string = string
> extends Array<Token<TType<Type>, Tag>> {}