import { parser } from "../../../index.js";
import { JSLexer, type TokenType } from "../lexer/index.js";
import type { 
    AnyFor,
    AnyImportSpecifier,
  ArrayExpression,
  ArrayPattern,
  ArrowFunctionExpression,
  Assignee,
  BlockComment,
  BlockStatement,
	CallExpression,
	ClassBody,
	ClassDeclaration,
	ClassMethod,
	ClassProperty,
	ClassProps,
	Consequent,
	DocComment,
	Expression, 
	ExpressionStatement, 
	ForInStatement, 
	ForOfStatement, 
	ForStatement, 
	FunctionDeclaration, 
	FunctionExpression, 
	Identifier, 
	IfStatement, 
	ImportDeclaration, 
	LineComment, 
	NodeTypes, 
	ObjectExpression, 
	ObjectPattern, 
	Parameter, 
	Property, 
	StringLiteral, 
	SwitchCase, 
	SwitchStatement, 
	VariableDeclaration, 
  VariableDeclarator
} from "./types.js";
import type { Token } from "../../../parser/lexer/Token.js";

export class JSParser extends parser.Parser<TokenType, NodeTypes> 
{

	constructor() {
		super(new JSLexer());
	}

  protected trim() {
		while (this.willContinue() && this.isAny("Br", "Tab", "Space")) {
			this.eat();
		}
	}

  protected trimsemi() {
    this.trim();
    while (this.willContinue() && this.is("Semicolon")) {
      this.trimeat();
    }
  }

  protected trimeat() {
    this.eat();
    this.trim()
  }

	protected override parse(): Expression {
		this.trim();
    let stmt;

		switch (this.type()) {

			case "SlashAsterisk": {
				stmt = this.parseBlockComment()
        break;
			}

			case "SlashDoubleAsterisk": {
				stmt = this.parseDocComment()
        break;
			}

      case "Import": {
        stmt = this.parseImportDeclaration()
        break;
      }

      case "For": {
        stmt = this.parseAnyFor()
        break;
      }

      case "Switch": {
        stmt = this.parseSwitchStatement()
        break;
      }

			case "Var":
			case "Let":
			case "Const": {
				stmt = this.parseVariableDeclaration()
        break;
			}

			case "Async": {
				this.eat();
				this.trim()
				if (!this.is("Function")) {
					throw "Expected function keyword after async."
				}

				stmt = this.parseFunctionDeclaration(true);
        break;
			}

			case "Function": {
				stmt = this.parseFunctionDeclaration(false);
        break;
			}

			case "Class": {
				stmt = this.parseClassDeclaration();
        break;
			}

			case "If": {
				stmt = this.parseIfStatement();
        break;
			}

      case "Return": {
        this.eat();
        this.trim();
        stmt = this.new("ReturnStatement", {
          node: this.parseExpression()
        });
        break;
      }

      case "Throw": {
        this.eat();
        this.trim();
        stmt = this.new("ThrowStatement", {
          node: this.parseExpression()
        });
        break;
      }

      case "Void": {
        this.eat();
        this.trim();
        stmt = this.new("VoidStatement", {
          node: this.parseExpression()
        });
        break;
      }

			case "OpenBracket": {
				stmt = this.parseBlock();
        break;
			}

			default:
				return this.parseExpressionStatement();
		}

    this.trimsemi();

    return stmt;
	}

  protected parseExpressionStatement(): ExpressionStatement {
    let stmt = this.new("ExpressionStatement", {
      expression: this.parseExpression()
    })
    this.trimsemi();
    return stmt;
  }

  protected parseBlockComment(): BlockComment {
		this.eat();
		let content = "";
		while (this.willContinue() && this.type() !== "AsteriskSlash") {
			content += this.eat().value;
		}
		
		this.expect("AsteriskSlash", "Expected asterisk slash to end Block comment.")
		this.trim();
		return this.new("BlockComment", {
			content,
		});
	}

  protected parseDocComment(): DocComment {
		this.eat();
		let content = "";
		while (this.willContinue() && this.type() !== "AsteriskSlash") {
			content += this.eat().value;
		}
		
		this.expect("AsteriskSlash", "Expected asterisk slash to end Doc comment.")
		this.trim();
		return this.new("DocComment", {
			content,
		});
	}

  protected parseLineComment(): LineComment {
		this.eat();
		let content = "";
		while (this.willContinue() && this.type() !== "Br") {
			content += this.eat().value;
		}
		
		this.expect("Br", "Expected break to end line comment.")
		this.trim();
		return this.new("LineComment", {
			content,
		});
	}

  protected parseVariableDeclaration(): VariableDeclaration {
		const kind = this.eat<"Const" | "Var" | "Let">().type;
		this.trim();
    const declarators = this.parseVarDeclarators(kind);
		
		return this.new("VariableDeclaration", {
			kind, 
      declarators
		})
	}

  protected parseVarDeclarators(kind: "Const" | "Var" | "Let"): VariableDeclarator[] {

    const declarators: VariableDeclarator[] = [];

    while(this.willContinue() && !this.isAny("Comma", "Semicolon")) {
      const id = this.parseAssignee();
      this.trim();
      if (this.is("Semicolon")) {
        declarators.push(this.new("VariableDeclarator", {
          id,
          init: null, 
        }))
        break;
      }
      this.expect("Equals", (
        `Expected Equals after identifier in ${kind} declaration`
      ))
      this.trim();
      declarators.push(this.new("VariableDeclarator", {
        id, init: this.parseExpression()
      }))
      this.trim();

      if (this.is("Comma")) {
        this.eat();
        this.trim();
      }
      else break;
    }

    return declarators;
  }

  protected parseImportDeclaration(): ImportDeclaration {
    this.eat()
    this.trim();
    const specifiers = this.parseImportSpecifiers();
    this.trim();
    this.expect("From", "Expected from after import specifiers.")
    this.trim();
    let source: StringLiteral
    if (this.is("SingleQuotes")) {
      source = this.parseString("Single");
    }
    else if (this.is("DoubleQuotes")) {
      source = this.parseString("Double");
    }
    else {
      throw "Expected string after from";
    }

    return this.new("ImportDeclaration", {
      specifiers,
      source
    })
  }

  protected parseImportSpecifiers(): AnyImportSpecifier[] {

    const specifiers: AnyImportSpecifier[] = [];
    while(this.willContinue() && !this.isAny("From", "Comma")) {

      if (this.is("Identifier")) {
        specifiers.push(this.new("ImportDefaultSpecifier", {
          local: this.parseIdentifier()
        }))
        this.trim();
      }
      else if (this.is("Asterisk")) {
        this.eat();
        this.trim();
        this.expect("As", "Expected as for namespace specifier");
        this.trim();
        specifiers.push(this.new("ImportNamespaceSpecifier", {
          local: this.parseIdentifier()
        }));
        this.trim();
      }
      else {
        this.expect("OpenBracket", "Expected bracket to list imports");
        this.trim();

        specs:
        while (this.willContinue() && this.isnt("CloseBracket")) {

          const imported = this.parseIdentifier();
          let local = imported;
          this.trim();
          if (this.is("As")) {
            this.eat();
            this.trim()
            local = this.parseIdentifier();
            this.trim()
          }

          specifiers.push(this.new("ImportSpecifier", {local, imported}))

          if (this.isnt("Comma")) break specs;
          this.eat();
          this.trim();
        }

        this.trim();
        this.expect("CloseBracket", "Expected bracket to end import list");
        this.trim();
      }
      if (this.isnt("Comma")) break;
      this.eat();
      this.trim();
    }

    return specifiers;
  }

  protected parseFunctionDeclaration(async: boolean): FunctionDeclaration {
		this.eat();
		this.trim();
		const generator = !!this.if("Asterisk");
		if (generator) {
			this.trim();
		}
		const id = this.parseIdentifier();
		this.trim();
		this.expect("OpenParen", (
			"Expected parenthesis after function identifier"
		))
		this.trim();

		const params = this.parseParameters();

		if (!this.is("OpenBracket")) throw (
			"Expected bracket to open function body"
		)
		this.trim();
		const body = this.parseBlock();
		this.trim();

		return this.new("FunctionDeclaration", {
			async, 
			generator,
			id, 
			params, 
			body, 
		})
	}

  protected parseParameters(): Parameter[] {
		const params: Parameter[] = [];

		while(this.willContinue() && this.isnt("CloseParen")) {
			let spread = this.is("Spread");
			if (spread) {
				this.eat();
				this.trim();
			}
      const id = this.parseAssignee();

      this.trim();
			let init: Expression | null = null;
			
      if (!spread && this.is("Equals")) {
        this.eat();
        this.trim();
				init = this.parseExpression();
			}

			params.push(this.new("Parameter", {
				spread,
				id,
				init,
			}))
			this.trim();
			
			if (this.type() === "Comma") {
				this.eat()
				this.trim();
			}
		}

		this.expect("CloseParen", (
			"Expected parenthesis to close function params"
		))
		this.trim();
		return params;
	}

  protected parseClassDeclaration(): ClassDeclaration {
		this.eat();
		this.trim();
		const id = this.parseIdentifier();
		this.trim();
		let extend: Expression | null = null;
		if (this.is("Extends")) {
			this.eat();
			this.trim();
			extend = this.parseExpression();
			this.trim();
		}

		this.expect("OpenBracket", (
			"Expected bracket to open class body"
		))
		this.trim();
		const body = this.parseClassBody();
		this.trim();

		return this.new("ClassDeclaration", {
			id, body, extend
		})
	}

  protected parseClassBody(): ClassBody {
		const props: ClassProps[] = [];
		while(this.willContinue() && this.isnt("CloseBracket")) {
			const priv = !!this.if("Hash");
			this.trim();
			if (this.isnt("Identifier")) {
				throw "Expected identifier";
			}
			const id = this.parseIdentifier();
			this.trim();
			if (this.is("OpenParen")) {
				props.push(this.parseClassMethod(id, priv))
			}
			else {
				props.push(this.parseClassProperty(id, priv))
			}
			this.trim();
		}
		this.expect("CloseBracket", (
			"Expected bracket to close class body"
		))
		this.trim();
		return this.new("ClassBody", {
			props
		})
	}
	
  protected parseClassMethod(id: Identifier, priv: boolean): ClassMethod {
		this.eat();
		this.trim();

		const params = this.parseParameters();
		this.trim();

		if (!this.is("OpenBracket")) throw (
			"Expected bracket to open class method body"
		)
		this.trim();
		const body = this.parseBlock();
		this.trim();

		return this.new("ClassMethod", {
			id,
			private: priv,
			params,
			body
		})
	}
	
  protected parseClassProperty(id: Identifier, priv: boolean): ClassProperty {
		
		let init: Expression | null = null;
		if (this.is("Equals")) {
			this.eat();
			this.trim();

			init = this.parseExpression();
			this.trim();
		}

		this.expect("Semicolon", "Expected semicolon to end property declaration");
		this.trim();

		return this.new("ClassProperty", {
			id,
			private: priv,
			init
		})
	}
	
  protected parseAnyFor(): AnyFor {
    this.trimeat();
    const awaits = this.is("Await");

    if (awaits) {
      this.trimeat();
    }

    this.expect("OpenParen", "Expected parenthesis after 'for'");
    this.trim();

    if (this.is("Semicolon")) {
      return this.parseForStatement(null);
    }

    let init;
    if (this.isAny("Const", "Var", "Let")) {
      const kind = this.eat<"Const" | "Var" | "Let">().type;
      this.trim();
      init = this.new("VariableDeclaration", {
        kind, 
        declarators: [
          this.new("VariableDeclarator", {
            id: this.parseAssignee(),
            init: null
          })
        ]
      })
    }
    else {
      init = this.parseExpression();
    }
    this.trim();

    if (awaits) {
      return this.parseForOfStatement(init, true);
    }
    if (this.is("Of")) {
      return this.parseForOfStatement(init, false);
    }
    if (this.is("In")) {
      return this.parseForInStatement(init);
    }
    else {
      return this.parseForStatement(init);
    }
  }
  
  protected parseForOfStatement(left: Expression, awaits: boolean): ForOfStatement {
    this.trimeat();

    const right = this.parseExpression();
    this.trim();

    this.expect("CloseParen", "Expected closing parenthesis in for expression");
    this.trim();

    const body = this.parseConsequent();
    this.trim();

    return this.new("ForOfStatement", {left, right, await: awaits, body});
  }
  
  protected parseForInStatement(left: Expression): ForInStatement {
    this.trimeat();

    const right = this.parseExpression();
    this.trim();

    this.expect("CloseParen", "Expected closing parenthesis in for expression");
    this.trim();

    const body = this.parseConsequent();
    this.trim();
  
    return this.new("ForInStatement", {left, right, body});
  }
  
  protected parseForStatement(init: Expression | null): ForStatement {
    this.expect("Semicolon", "Expected semicolon after 'init'");
    this.trim();

    let test;

    if (this.is("Semicolon")) {
      this.trimeat();
      test = null;
    }
    else {
      test = this.parseExpression();
      this.trim();
    }
    this.expect("Semicolon", "Expected semicolon after 'test'");
    this.trim();

    let update;

    if (this.is("CloseParen")) {
      update = null;
    }
    else {
      update = this.parseExpression();
      this.trim();
    }
    this.expect("CloseParen", "Expected closing parenthesis in for expression");
    this.trim();

    const body = this.parseConsequent();
    this.trim();
  
    return this.new("ForStatement", {init, test, update, body});
  }
  
  protected parseIfStatement(): IfStatement {
		this.eat();
		this.trim();
		this.expect("OpenParen", (
			"Expected parenthesis after If keyword"
		))
		this.trim();
		const test = this.parseExpression();
		this.trim();
		this.expect("CloseParen", (
			"Expected parenthesis after If condition"
		))
		this.trim();
		const consequent = this.parseConsequent();
    this.trim();
		const if_stmt = this.new("IfStatement", {
			test,
			consequent,
      alternate: null
		})
    this.trim();

    if (this.isnt("Else")) return if_stmt;
    this.eat();
    this.trim();
    if (this.is("If")) {
      if_stmt.alternate = this.parseIfStatement();
    }
    else {
      if_stmt.alternate = this.parseConsequent();
    }
    this.trim();
    return if_stmt;
	}
  
  protected parseSwitchStatement(): SwitchStatement {
    this.eat();
    this.trim();
    this.expect("OpenParen", (
      "Expected parenthesis after switch keyword"
    ))
    this.trim();
    const discriminant = this.parseExpression();
    this.trim();
    this.expect("CloseParen", (
      "Expected parenthesis after switch discriminant expression"
    ))
    this.trim();

    const cases: SwitchCase[] = [];
    
    this.expect("OpenBracket", (
      "Expected OpenBracket after switch discriminant"
    ))
    this.trim();

    while (this.willContinue() && this.isnt("CloseBracket")) {

      if (this.is("Case")) {
        this.trimeat();
        const test = this.parseExpression();
        this.expect("Colon", "Expected colon after switch case expression");
        this.trim();
        let consequent;
        if (this.is("Case")) {
          consequent = null;
        } 
        else {
          consequent = this.parseConsequent();
          this.trim();
        }
        cases.push(this.new("SwitchCase", {consequent, test}))
      }
      else if (this.is("Default")) {
        this.trimeat();
        this.expect("Colon", "Expected colon after switch default case");
        this.trim();
        const consequent = this.parseConsequent();
        cases.push(this.new("SwitchCase", {consequent, test: null}))
      }
      else {
        throw `Unexpected token ${this.type()} inside switch body`;
      }
      this.trim();

    }

    return this.new("SwitchStatement", {
      discriminant,
      cases
    })
  }

  protected parseConsequent(): Consequent {
    if (this.is("OpenBracket")) {
      return this.parseBlock();
    }
    if (this.is("Semicolon")) {
      this.eat();
      return this.new("EmptyExpression", {});
    }
    return this.parseExpressionStatement();
  }

  protected parseBlock(): BlockStatement {
		this.eat();
		this.trim();

		const body: Expression[] = [];
		while (this.willContinue() && this.isnt("CloseBracket")) {
			body.push(this.parse());
			this.trim();
		}

		this.expect("CloseBracket", "Expected bracket to end block");
		this.trim();
		return this.new("BlockStatement", {body: body})
	}

  protected parseExpression(): Expression {
		return this.parseAssignment();
	}

  protected parseAssignment(): Expression {
		const assigne = this.parseAdditive();
		this.trim();

		if (this.willContinue() && this.isAny(
			"Equals", "PlusEquals", "DashEquals",
			"PercentEquals", "SlashEquals", "AsteriskEquals"
		)) {
			const operator = this.eat().type;
			this.trim();
			const value = this.parseExpression();
			this.trim();

			return this.new("AssignmentExpression", {
				assigne, operator, value
			})
		}

		return assigne;
	}

  protected parseAdditive(): Expression {

    const left = this.parseMultiplicative();

    this.trim();
    if (this.willContinue() && this.isAny("Dash", "Plus")) {
      const operator = this.eat().type;
      this.trim();
      return this.new("BinaryExpression", {
        kind: "add",
        left,
        operator,
        right: this.parseExpression(),
      })
    }

    return left;
  }

  protected parseMultiplicative(): Expression {

		const left = this.parseComparative();

		this.trim();
		if (this.willContinue() && this.isAny("Asterisk", "Slash", "Percent")) {
			const operator = this.eat().type;
			this.trim();
			return this.new("BinaryExpression", {
        kind: "mul",
				operator,
				left,
				right: this.parseExpression(),
			})
		}

		return left;
	}

  protected parseComparative(): Expression {

    const left = this.parseMemberCall();

    this.trim();
    if (this.willContinue() && this.isAny(
      "DoublePipe", "DoubleAmpersand", 
      "DoubleEquals",
      "TripleEquals",
      "MoreThanEqual", "MoreThan",
      "LessThanEqual", "LessThan",
    )) {
      const operator = this.eat().type;
      this.trim();
      return this.new("BinaryExpression", {
        kind: "com",
        operator,
        left,
        right: this.parseExpression(),
      })
    }

    return left;
  }

  protected parseMemberCall(): Expression {
		let member: Expression = this.parseMember();
		this.trim();
		if (this.is("OpenParen")) {
			member = this.parseCall(member)
		}
		return member;
	}

  protected parseMember(): Expression {
		let object = this.parsePrimary();
		this.trim();
		while (this.willContinue() && this.isAny("Period", "OpenSquare")) {

			const computed = this.is("OpenSquare");
			this.eat();
			this.trim();
			const property = this.parseExpression();
			this.trim();

			if (computed) {
				this.expect("CloseSquare", (
					"Expected closing square bracket in member expression"
				))
				this.trim();
			}

			object = this.new("MemberExpression", {
				object,
				computed,
				property,
			})

		}
		return object;
	}

  protected parseCall(caller: Expression): CallExpression {
		this.eat();
		this.trim();
		const args: Expression[] = [];
		while(this.willContinue() && this.isnt("CloseParen")) {
			args.push(this.parseExpression());
			this.trim();
			
			if (this.type() === "Comma") {
				this.eat()
				this.trim();
			}
		}
		this.expect("CloseParen", (
			"Expected closing parenthesis to end argument list"
		))
		this.trim();
		let callExpr = this.new("CallExpression", {
			caller,
			args
		})
		if (this.is("OpenParen")) {
			callExpr = this.parseCall(callExpr);
			this.trim();
		}
		return callExpr;
	}

  protected parseAssignee(): Assignee {

    switch(this.type()) {

      case "OpenBracket": {
        return this.parseObjectPattern();
      }

      case "OpenSquare": {
        return this.parseArrayPattern();
      }

      case "Identifier": {
        return this.parseIdentifier();
      }

      default: throw (
        `Unexpected assigne of type ${this.type()}`
      )
    }
  }

  protected parseSubAssignee(): Assignee {
    const left = this.parseAssignee();
    this.trim();
    if (this.willContinue() && this.isAny(
      "Equals", "PlusEquals", "DashEquals",
      "PercentEquals", "SlashEquals", "AsteriskEquals"
    )) {
      const operator = this.eat().type;
      this.trim();
      const right = this.parseExpression();
      this.trim();

      return this.new("AssignmentPattern", {
        left, 
        operator, 
        right
      })
    }
    return left;
  }

  protected parsePrimary(): Expression {
		switch(this.type()) {
      case "Async": {
        this.eat();
        this.trim()
        if (this.is("OpenParen")) {
          return this.parseArrowFunctionExpression(true);
        }
        if (!this.is("Function")) {
          throw "Expected function keyword after async."
        }

        return this.parseFunctionExpression(true);
      }

      case "Function": {
        return this.parseFunctionExpression(false);
      }

      case "DoubleSlash": {
        return this.parseLineComment();
      }

      case "SingleQuotes": {
        return this.parseString("Single"); 
      }

      case "DoubleQuotes": {
        return this.parseString("Double");
      }

			case "New": {
				return this.parseKeywordExpression("NewExpression")
			}

      case "Await": {
        return this.parseKeywordExpression("AwaitExpression")
      }

      case "TypeOf": {
        return this.parseKeywordExpression("TypeOfExpression")
      }

      case "InstanceOf": {
        return this.parseKeywordExpression("InstanceOfExpression")
      }

			case "OpenBracket": {
        return this.parseObjectExpression();
			}

			case "OpenSquare": {
        return this.parseArrayExpression();
			}

			case "OpenParen": {

        if (this.afterGroup("Arrow")) {
          return this.parseArrowFunctionExpression(false);
        }

        this.eat();
        this.trim();
        const node = this.parseExpression();
        this.trim();

        if (this.if("CloseParen")) {
          this.trim();
          return node;
        }

        this.expect("Comma", "Expected comma for sequence");
        this.trim();
        const nodes: Expression[] = [node];
        while (this.willContinue() && this.isnt("CloseParen")) {
          nodes.push(this.parseExpression())
          this.trim();
          if (this.is("Comma")) {
            this.eat();
            this.trim();
          }
          else break;
        }
        this.expect("CloseParen", 
          "Expected closing parenthesis to end group expression."
        )
        return this.new("SequenceExpression", {nodes})
			}

			case "Number": {
				return this.parseNumericLiteral();
			}

			case "Identifier": {
				const argument = this.parseIdentifier();
        this.trim();
        if (this.isAny("DoublePlus", "DoubleDash")) {
          const operator = this.eat().type;
          return this.new("UpdateExpression", {
            argument,
            operator,
            prefix: false
          })
        }
        return argument;
			}

      case "Plus": 
      case "Exclamation": 
      case "Dash": {
        const operator = this.eat().type;
        this.trim();
        const argument = this.parseExpression();
        return this.new("UnaryExpression", {
          argument,
          operator,
          prefix: true
        })
      }

      case "DoublePlus": 
      case "DoubleDash": {
        const operator = this.eat().type;
        this.trim();
        const argument = this.parseIdentifier();
        return this.new("UpdateExpression", {
          argument,
          operator,
          prefix: true
        })
      }

			default: {
				throw "Primary expression";
			}
		}
	}

  protected afterGroup(tokenType: TokenType) {
    return this.lookAhead((tokens) => {
      let depth = 0;

      while (tokens.length) {
        if (tokens[0]!.type === "OpenParen") {
          depth++;
        }
        else if (tokens[0]!.type === "CloseParen") {
          tokens.shift();
          if (depth === 1) {
            while (tokens.length && ["Br", "Tab", "Space"].includes(tokens[0]!.type))  {
              tokens.shift();
            }
            return (tokens[0] as Token<TokenType>)!.type === tokenType;
          }
          else depth--;
        }
        tokens.shift();
      }

      return false;
    })
  }

  protected parseFunctionExpression(async: boolean): FunctionExpression {
    this.eat();
    this.trim();
    const generator = !!this.if("Asterisk");
    if (generator) {
      this.trim();
    }

    let id: Identifier | null = null;

    if (this.is("Identifier")) {
      id = this.parseIdentifier();
      this.trim();
    }
    this.expect("OpenParen", (
      "Expected parenthesis after function identifier"
    ))
    this.trim();

    const params = this.parseParameters();

    if (!this.is("OpenBracket")) throw (
      "Expected bracket to open function body"
    )
    this.trim();
    const body = this.parseBlock();
    this.trim();

    return this.new("FunctionExpression", {
      async, 
      generator,
      id,
      params, 
      body, 
    })
  }

  protected parseArrowFunctionExpression(async: boolean): ArrowFunctionExpression {
    this.eat();
    this.trim();

    const params = this.parseParameters();
    this.trim();
    this.expect("Arrow", "Expected arrow after parameters list");
    this.trim();

    let body: BlockStatement | Expression
    const expression = !this.is("OpenBracket");

    if (expression) {
      body = this.parseExpression();
    }
    else {
      body = this.parseBlock();
    }
    this.trim();

    return this.new("ArrowFunctionExpression", {
      async, 
      params, 
      body,
      expression
    })
  }

  protected parseIdentifier(): Identifier {
    const symbol =  this.expect("Identifier",
      "Expected identifier"
    ).value
		return this.new("Identifier", {symbol})
	}

  protected parseKeywordExpression(nt: keyof NodeTypes): Expression {
    this.eat();
    this.trim();
    // @ts-expect-error
    return this.new(nt, {
      node: this.parseExpression()
    })
  }
 
  protected parseString(quotes: "Single" | "Double"): StringLiteral {
		this.eat();
		const quoteType: TokenType = `${quotes}Quotes`;
		let content = "";
		while (this.willContinue() && this.type() !== quoteType) {
			content += this.eat().value;
		}
		
		this.expect(quoteType, "Expected closing quotes to end String literal.")
		this.trim();
		return this.new("StringLiteral", {
			content,
			quotes
		});
	}

  protected parseArrayExpression(): ArrayExpression {

    this.eat();
    this.trim();
    const entries: Expression[] = [];
    while (this.willContinue() && this.type() !== "CloseSquare") {
      entries.push(this.parseExpression());
      this.trim();
      if (this.type() === "Comma") {
        this.eat()
        this.trim();
      }
    }
    const array = this.new("ArrayExpression", {items: entries})
    this.trim();
    this.expect("CloseSquare", 
      "Expected closing square bracket to end Array literal."
    )
    return array;
  }

  protected parseArrayPattern(): ArrayPattern {

    this.eat();
    this.trim();
    const entries: Expression[] = [];
    while (this.willContinue() && this.type() !== "CloseSquare") {
      entries.push(this.parseSubAssignee());
      this.trim();
      if (this.type() === "Comma") {
        this.eat()
        this.trim();
      }
    }
    const array = this.new("ArrayPattern", {items: entries})
    this.trim();
    this.expect("CloseSquare", 
      "Expected closing square bracket to end Array literal."
    )
    return array;
  }

  protected parseObjectExpression(): ObjectExpression {
    this.eat();
    this.trim();
    const props: Property[] = [];
    while (this.willContinue() && this.type() !== "CloseBracket") {

      const key = this.expect("Identifier", 
        "Expected identifier as key"
      ).value;
      this.trim();
      let value: Expression | null = null;

      if (this.is("Colon")) {
        this.eat();
        this.trim();
        value = this.parseExpression();
        this.trim();
      }

      props.push(this.new("Property", {key, init: value}));

      if (this.type() === "Comma") {
        this.eat()
        this.trim();
      }
    }
    const obj = this.new("ObjectExpression", {props})
    this.trim();
    this.expect("CloseBracket", 
      "Expected closing bracket to end Object literal."
    )
    return obj;
  }

  protected parseObjectPattern(): ObjectPattern {
    this.eat();
    this.trim();
    const props: Property[] = [];
    while (this.willContinue() && this.type() !== "CloseBracket") {

      const key = this.expect("Identifier", 
        "Expected identifier as key"
      ).value;
      this.trim();
      let value: Expression | null = null;

      if (this.is("Equals")) {
        this.eat();
        this.trim();
        value = this.parseExpression();
        this.trim();
      }

      props.push(this.new("Property", {key, init: value}));

      if (this.type() === "Comma") {
        this.eat()
        this.trim();
      }
    }
    const obj = this.new("ObjectPattern", {props})
    this.trim();
    this.expect("CloseBracket", 
      "Expected closing bracket to end Object pattern."
    )
    return obj;
  }

  protected parseNumericLiteral() {
    let raw = this.eat().value;
    let float = this.type() === "Period";

    if (float) {
      raw += this.eat().value;
      raw += this.expect("Number", 
        "Expected number after decimal period"
      ).value;
    }

    return this.new("NumericLiteral", {
      value: parseInt(raw),
      raw,
      float
    })
  }
}