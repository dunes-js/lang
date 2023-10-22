import type { Value } from "./types.js";


export class Environment<AnyValue extends Value<any>> {
  readonly #vars = new Map<string, AnyValue>();
  constructor(readonly parent: Environment<AnyValue> | null) {}
  
  declare(name: string, value: AnyValue): void {
    if (this.#vars.has(name)) throw `Cannot redeclare scoped var ${name}`;
    this.#vars.set(name, value);
  }
  
  assign(name: string, value: AnyValue): void {
    this.#resolve(name).#vars.set(name, value);
  }
  
  find(name: string): AnyValue {
    return this.#resolve(name).#vars.get(name)!;
  }

  with(props: {[key: string]: AnyValue}): this {
    this.#vars.clear();

    for (const prop in props) {
      this.#vars.set(prop, props[prop]!);
    }

    return this;
  }

  #resolve(name: string): Environment<AnyValue> {
    if (this.#vars.has(name)) return this;
    if (!this.parent) throw `Variable ${name} is undefined`;
    return this.parent.#resolve(name);
  }

  child(): Environment<AnyValue> {
    return new Environment(this);
  }
}