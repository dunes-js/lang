// @ts-nocheck



import { readFile } from "fs/promises";
import { Lex } from "./Lexer.js";
import type { Token } from "./Token.js";
import type { TknType, TagType } from "./types.js";

type JsonTknType<T extends string> = TknType<T | "Unknown">
type JsonTagType<T extends string> = TagType<T>

export async function readLex<
  Type extends string,
  Tag extends string
>(path: string): Promise<Lex<JsonTknType<Type>, JsonTagType<Tag>>> {
  const str = (await readFile(path)).toString("utf8");
  const jsonL: JSONLex<Type, Tag> = JSON.parse(str);
  return jsonLex(jsonL);
}

export function jsonLex<
  Type extends string,
  Tag extends string
>(lex: JSONLex<Type, Tag>): Lex<JsonTknType<Type>, JsonTagType<Tag>> {

  return new class extends Lex<JsonTknType<Type>, JsonTagType<Tag>> {

    protected override read() {
      for (const condition of lex.conditions) {
      }
      return this.new("Unknown");
    }
}

}

interface JSONLex<
  Type extends string,
  Tag extends string
> {
  conditions: Condition<JsonTknType<Type>, JsonTagType<Tag>>[]
}


type Condition<
  Type extends string,
  Tag extends string
> = SetCondition<Type, Tag>

type SetCondition<
  Type extends string,
  Tag extends string
> = {
  when
}

type When = (
  | string
  | {
    match: RegExp
  }
  | {
    (str: string): any
  }
)