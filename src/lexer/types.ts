import type { Token } from "./Token.js";

export interface Position {
	line: number,
	column: number
}

export type TokenList<
  Type extends string,
  Tag extends string
> = Array<Token<TknType<Type>, TagType<Tag>>>


export type TknType<T extends string> = T | "EOF";
export type TagType<T extends string> = T | "WhiteSpace";