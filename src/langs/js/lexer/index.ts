import { lexer } from "../../../index.js";
import type { TokenTag, TokenType } from "./types.js";
export type { TokenType, TokenTag }

export class JSLexer extends lexer.Lexer<TokenType, TokenTag> {

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
      let word;
			switch (value) {
				case "let": word = this.new("Let", ...chars); break;
				case "var": word = this.new("Var", ...chars); break;
				case "switch": word = this.new("Switch", ...chars); break;
        case "try": word = this.new("Try", ...chars); break;
        case "catch": word = this.new("Catch", ...chars); break;
        case "finally": word = this.new("Finally", ...chars); break;
        case "case": word = this.new("Case", ...chars); break;
        case "break": word = this.new("Break", ...chars); break;
        case "continue": word = this.new("Continue", ...chars); break;
        case "const": word = this.new("Const", ...chars); break;
        case "for": word = this.new("For", ...chars); break;
				case "if": word = this.new("If", ...chars); break;
        case "of": word = this.new("Of", ...chars); break;
        case "in": word = this.new("In", ...chars); break;
				case "else": word = this.new("Else", ...chars); break;
        case "as": word = this.new("As", ...chars); break;
        case "do": word = this.new("Do", ...chars); break;
        case "while": word = this.new("While", ...chars); break;

				case "new": word = this.new("New", ...chars); break;
				case "void": word = this.new("Void", ...chars); break;
				case "async": word = this.new("Async", ...chars); break;
				case "return": word = this.new("Return", ...chars); break;
        case "throw": word = this.new("Throw", ...chars); break;
				case "instanceof": word = this.new("InstanceOf", ...chars); break;
				case "typeof": word = this.new("TypeOf", ...chars); break;
        case "await": word = this.new("Await", ...chars); break;
				
				case "from": word = this.new("From", ...chars); break;
        case "default": word = this.new("Default", ...chars); break;
        case "import": word = this.new("Import", ...chars); break;
        case "export": word = this.new("Export", ...chars); break;
        case "function": word = this.new("Function", ...chars); break;
				case "class": word = this.new("Class", ...chars); break;
				case "extends": word = this.new("Extends", ...chars); break;
				default: 
					word = this.new("Identifier", ...chars);
			}
      word.setTag("Word");
      return word;
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

		if (this.is("?")) {
			const mark = this.eat();
			if (this.is("."))
				return this.new("Optional", mark, this.eat());
			return this.new("Question", mark);
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