import type { lexer } from "../../../index.js";


export type TokenType = lexer.TType<(
	
	| "Let"
	| "Var"
	| "Const"
	| "Function"
  | "Arrow"
	| "Async"
  | "Import"
  | "Export"
  | "From"
  | "Do"
  | "While"
  | "Default"
	| "Class"
  | "Finally"
  | "Try"
  | "Catch"
  | "As"
  | "String"
	| "If"
  | "Of"
  | "Switch"
  | "Case"
  | "Break"
  | "Continue"
  | "In"
	| "Else"
	| "For"
  | "Throw"
  | "Return"
  | "Optional"
	| "Void"
	| "New"
  | "Await"
	| "TypeOf"
	| "InstanceOf"
  
  | "Exclamation"
  | "Question"

	| "Br"
	| "Tab"
	| "Space"
	
	| "Undefined"

	| "Number"
	| "Identifier"

	| "Plus"
  | "DoublePlus"
	| "PlusEquals"
	| "Dash"
  | "DoubleDash"
	| "DashEquals"
	| "Slash"
	| "SlashEquals"
	| "Percent"
	| "PercentEquals"
  | "OpenTemplate"
	| "Asterisk"
	| "AsteriskEquals"
	
	| "Equals"
  | "DoubleEquals"
  | "TripleEquals"
  | "Ampersand"
  | "AmpersandEquals"
  | "DoubleAmpersand"
  | "Pipe"
  | "PipeEquals"
  | "DoublePipe"
  | "LessThan"
  | "LessThanEqual"
  | "MoreThan"
  | "MoreThanEqual"

	| "Spread"
  | "BackSlash"
	| "Extends"
	| "BackQuote"

	| "DoubleSlash"
	| "SlashAsterisk"
	| "SlashDoubleAsterisk"
	| "AsteriskSlash"

	| "Hash"
	| "Semicolon"
	| "Colon"
	| "Comma"
	| "Period"

	// ()
	| "OpenParen" 
	| "CloseParen"
	// {}
	| "OpenBracket" 
	| "CloseBracket"
	// []
	| "OpenSquare" 
	| "CloseSquare"
)>

export type TokenTag = (
  | "Word"
)