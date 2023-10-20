import { lexer } from "../../../index.js";
import type { TokenType } from "./types.js";
export type { TokenType }

export class JSLexer extends lexer.Lexer<TokenType> {

	protected override read() {

    if (this.is('"')) {
      const chars: lexer.Char[] = [this.eat()];

      while (!this.finished() && !this.is('"')) {
        const val = this.eat();
        chars.push(val);
        if (val.value === '\\') {
          if (this.finished()) {
            throw "Expected character after escape";
          }
          chars.push(this.eat());
        }
      }
      return this.new("String", ...chars, this.eat());
    }

    if (this.is("'")) {
      const chars: lexer.Char[] = [this.eat()];

      while (!this.finished() && !this.is("'")) {
        const val = this.eat();
        chars.push(val);
        if (val.value === '\\') {
          if (this.finished()) {
            throw "Expected character after escape";
          }
          chars.push(this.eat());
        }
      }
      return this.new("String", ...chars, this.eat());
    }

    if (this.is("$") && this.is("{", 1)) {
      return this.new("OpenTemplate", this.eat(), this.eat());
    }

		if (this.isLetter() || this.is("$")) {
			const chars: lexer.Char[] = [this.eat()];
			while (!this.finished() && (
        this.isLetter() || this.is("$") || this.match(/[0-9]|_/)
      )) {
				chars.push(this.eat());
			}

			const value = chars.map(({value}) => value).join("");

			switch (value) {
				case "let": return this.new("Let", ...chars);
				case "var": return this.new("Var", ...chars);
				case "switch": return this.new("Switch", ...chars);
        case "try": return this.new("Try", ...chars);
        case "catch": return this.new("Catch", ...chars);
        case "finally": return this.new("Finally", ...chars);
        case "case": return this.new("Case", ...chars);
        case "break": return this.new("Break", ...chars);
        case "continue": return this.new("Continue", ...chars);
        case "const": return this.new("Const", ...chars);
        case "for": return this.new("For", ...chars);
				case "if": return this.new("If", ...chars);
        case "of": return this.new("Of", ...chars);
        case "in": return this.new("In", ...chars);
				case "else": return this.new("Else", ...chars);
        case "as": return this.new("As", ...chars);

				case "new": return this.new("New", ...chars);
				case "void": return this.new("Void", ...chars);
				case "async": return this.new("Async", ...chars);
				case "return": return this.new("Return", ...chars);
        case "throw": return this.new("Throw", ...chars);
				case "instanceof": return this.new("InstanceOf", ...chars);
				case "typeof": return this.new("TypeOf", ...chars);
        case "await": return this.new("Await", ...chars);
				
				case "from": return this.new("From", ...chars);
        case "default": return this.new("Default", ...chars);
        case "import": return this.new("Import", ...chars);
        case "export": return this.new("Export", ...chars);
        case "function": return this.new("Function", ...chars);
				case "class": return this.new("Class", ...chars);
				case "extends": return this.new("Extends", ...chars);
				default: 
					return this.new("Identifier", ...chars);
			}

		}

		if (this.match(/[0-9]/)) {
			const chars: lexer.Char[] = [this.eat()];
			while (!this.finished() && this.match(/[0-9]/)) {
				chars.push(this.eat());
			}
			return this.new("Number", ...chars);
		}

		if (this.is(".")) {
			const period = this.eat();
			if (this.is(".") && this.is(".", 1)) {
				return this.new("Spread", period, this.eat(), this.eat());
			}
			
			return this.new("Period", period);

		}

		if (this.is("/")) {
			const slash = this.eat();
			if (this.is("*")) {
				const asterisk = this.eat();
				if (this.is("*")) {
					return this.new("SlashDoubleAsterisk", slash, asterisk, this.eat());
				}
				return this.new("SlashAsterisk", slash, asterisk);
			}
			if (this.is("=")) {
				return this.new("SlashEquals", slash, this.eat());
			}
			if (this.is("/")) {
				return this.new("DoubleSlash", slash, this.eat());
			}
			return this.new("Slash", slash);
		}

		if (this.is("*")) {
			const ast = this.eat();
			if (this.is("="))
				return this.new("AsteriskEquals", ast, this.eat());
			if (this.is("/"))
				return this.new("AsteriskSlash", ast, this.eat());
			return this.new("Asterisk", ast);
		}

		if (this.is("+")) {
			const plus = this.eat();
			if (this.is("+"))
				return this.new("DoublePlus", plus, this.eat());
      if (this.is("="))
        return this.new("PlusEquals", plus, this.eat());
			return this.new("Plus", plus);
		}

		if (this.is("-")) {
			const dash = this.eat();
      if (this.is("-"))
        return this.new("DoubleDash", dash, this.eat());
			if (this.is("="))
				return this.new("DashEquals", dash, this.eat());
			return this.new("Dash", dash);
		}

		if (this.is("%")) {
			const percent = this.eat();
			if (this.is("="))
				return this.new("PercentEquals", percent, this.eat());
			return this.new("Percent", percent);
		}

    if (this.is("&")) {
      const amp = this.eat();
      if (this.is("&"))
        return this.new("DoubleAmpersand", amp, this.eat());
      if (this.is("="))
        return this.new("AmpersandEquals", amp, this.eat());
      return this.new("Ampersand", amp);
    }

    if (this.is("|")) {
      const pipe = this.eat();
      if (this.is("|"))
        return this.new("DoublePipe", pipe, this.eat());
      if (this.is("="))
        return this.new("PipeEquals", pipe, this.eat());
      return this.new("Pipe", pipe);
    }

    if (this.is(">")) {
      const more = this.eat();
      if (this.is("="))
        return this.new("MoreThanEqual", more, this.eat());
      return this.new("MoreThan", more);
    }

    if (this.is("<")) {
      const less = this.eat();
      if (this.is("="))
        return this.new("LessThanEqual", less, this.eat());
      return this.new("LessThan", less);
    }

    if (this.is("=")) {
      const equals = this.eat();
      if (this.is("=")) {
        const equals2 = this.eat();
        if (this.is("="))
          return this.new("TripleEquals", equals, equals2, this.eat());
        return this.new("DoubleEquals", equals, equals2);
      }
      if (this.is(">")) {
        const point = this.eat();
        return this.new("Arrow", equals, point);
      }
      return this.new("Equals", equals);
    }


		switch(this.value()) {
			case"\n": return this.new("Br", this.eat());
			case"\t": return this.new("Tab", this.eat());
			case " ": return this.new("Space", this.eat());
			case '`': return this.new("BackQuote", this.eat());
      case '\\': return this.new("BackSlash", this.eat());

			case "!": return this.new("Exclamation", this.eat());
      case "?": return this.new("Question", this.eat());
      case "#": return this.new("Hash", this.eat());

			case ";": return this.new("Semicolon", this.eat());
			case ":": return this.new("Colon", this.eat());
			case ",": return this.new("Comma", this.eat());

			case "(": return this.new("OpenParen", this.eat());
			case ")": return this.new("CloseParen", this.eat());

			case "{": return this.new("OpenBracket", this.eat());
			case "}": return this.new("CloseBracket", this.eat());

			case "[": return this.new("OpenSquare", this.eat());
			case "]": return this.new("CloseSquare", this.eat());
			default:
				return this.new("Undefined", this.eat());
		}
	}

}