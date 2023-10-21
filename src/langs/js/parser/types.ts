import { parser } from "../../../index.js";
import type { TokenType } from "../lexer/index.js";

export type NodeType = (
  | "FunctionDeclaration"
  | "ClassDeclaration"
  | "FunctionDeclaration"
  | "VariableDeclaration"
  | "VariableDeclarator"
  | "BlockStatement"
  | "IfStatement"

  | "TemplateStringExpression"
  
  | "ImportDeclaration"
  | "ImportSpecifier"
  | "ImportDefaultSpecifier"
  | "ImportNamespaceSpecifier"

  | "ExportNamedDeclaration"
  | "ExportDefaultDeclaration"
  | "ExportAllDeclaration"
  
  | "ExportSpecifier"
  | "LabeledStatement"
  | "ConditionalExpression"

	| "BinaryExpression"
  | "CallExpression"
  | "AssignmentExpression"
  | "MemberExpression"
  | "SequenceExpression"
  | "DoWhileStatement"
  | "WhileStatement"
  
  | "BlockComment"
  | "LineComment"
  | "DocComment"

  | "ObjectExpression"
  | "ObjectPattern"
  
  | "ArrayExpression"
  | "ArrayPattern"
  | "AssignmentPattern"
  | "EmptyExpression"

	| "PropertyExpression"
  | "Identifier"
  | "PrivateIdentifier"
  | "UnaryExpression"
  
  | "TryStatement"
  | "CatchClause"
  
  | "UpdateExpression"
  | "ForInStatement"
	| "ForOfStatement"
  | "ForStatement"

  | "SwitchStatement"
  | "PropertyPattern"
  | "SwitchCase"
  
  | "ClassBody"
  | "ClassMethod"
  | "ClassProperty"

	| "FunctionExpression"
  | "ClassExpression"
  | "ArrowFunctionExpression"
  | "BreakStatement"
  | "ContinueStatement"

  | "RestElement"
  | "SpreadElement"

  | "ReturnStatement"
  | "ThrowStatement"
	| "NewExpression"
  | "AwaitExpression"
  | "ExpressionStatement"

  | "NumericLiteral"
  | "StringLiteral"
  | "RegExpLiteral"
  | "TemplateStringLiteral"
  | "TemplateElement"
)

export type SourceType = "cjs" | "esm"

export type AnyNode = (
  | FunctionDeclaration
  | ClassDeclaration
  | FunctionDeclaration
  | VariableDeclaration
  | VariableDeclarator
  | BlockStatement
  | IfStatement
  | ConditionalExpression

  | BinaryExpression
  | CallExpression
  | AssignmentExpression
  | MemberExpression
  | SequenceExpression
  
  | BlockComment
  | LineComment
  | DocComment
  | EmptyExpression

  | RegExpLiteral
  | StringLiteral
  | NumericLiteral
  | TemplateStringLiteral
  | TemplateElement
  | PropertyPattern

  | ImportDeclaration
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier

  | TryStatement
  | CatchClause

  | RestElement
  | SpreadElement
  | ObjectPattern
  | DoWhileStatement
  | WhileStatement

  | ExportSpecifier
  | ExportDefaultDeclaration
  | ExportAllDeclaration
  | ExportNamedDeclaration

  | UpdateExpression
  | UnaryExpression
  | ForInStatement
  | ForOfStatement
  | ForStatement

  | ArrayExpression
  | LabeledStatement
  | BreakStatement
  | ContinueStatement
  | ObjectExpression
  | PropertyExpression
  | Identifier
  | PrivateIdentifier
  
  | AssignmentPattern
  | TemplateStringExpression
  | ArrayPattern
  
  | ClassBody
  | ClassMethod
  | ClassProperty

  | FunctionExpression
  | ClassExpression
  | ArrowFunctionExpression
  | ExpressionStatement

  | SwitchStatement
  | SwitchCase

  | ReturnStatement
  | ThrowStatement
  | NewExpression
  | AwaitExpression
)

export type AnyDeclaration = (
  | FunctionDeclaration
  | ClassDeclaration
  | VariableDeclaration
)

export type AnyExportDeclaration = (
  | ExportDefaultDeclaration
  | ExportAllDeclaration
  | ExportNamedDeclaration
)

export type AnyImportSpecifier = (
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
)

export type AnyIdentifier = (
  | Identifier
  | PrivateIdentifier
)

export type Assignee = (
  | AnyIdentifier
  | ObjectPattern
  | ArrayPattern
  | AssignmentPattern
  | RestElement
)

export type Literal = (
  | RegExpLiteral
  | StringLiteral
  | NumericLiteral
  | TemplateStringLiteral
)

export type PropPattern = (
  | PropertyPattern
  | RestElement
)

export type PropExpression = (
  | PropertyExpression
  | SpreadElement
)

export type AnyFor = (
  | ForStatement
  | ForOfStatement
  | ForInStatement
)

export type ClassProp = (
  | ClassMethod 
  | ClassProperty
)

export type Consequent = (
  | BlockStatement 
  | ExpressionStatement
  | EmptyExpression
)

export interface Expression extends parser.Node<NodeType> {}

export interface Statement extends Expression {}

// ===== GENERAL =====

// ----- Comment

export interface LineComment extends Expression {
  type: "LineComment"
  content: string
}

export interface DocComment extends Statement {
  type: "DocComment"
  content: string
}

export interface BlockComment extends Statement {
  type: "BlockComment"
  content: string
}

// ----- Body

export interface BlockStatement extends Statement {
  type: "BlockStatement"
  body: Expression[];
}

export interface ExpressionStatement extends Statement {
	type: "ExpressionStatement"
	expression: Expression;
}

export interface EmptyExpression extends Expression {
  type: "EmptyExpression"
}

// ===== Declaration

// ----- Variable

export interface VariableDeclaration extends Statement {
  type: "VariableDeclaration"
  kind: "Var" | "Let" | "Const"
  declarators: VariableDeclarator[]
}

export interface VariableDeclarator extends Expression {
  type: "VariableDeclarator"
  id: Assignee
  init: Expression | null
}

// ----- Import

export interface ImportDeclaration extends Statement {
  type: "ImportDeclaration"
  specifiers: AnyImportSpecifier[]
  source: StringLiteral
}

export interface ImportSpecifier extends Expression {
  type: "ImportSpecifier"
  imported: AnyIdentifier
  local: AnyIdentifier
}

export interface ImportDefaultSpecifier extends Expression {
  type: "ImportDefaultSpecifier"
  local: AnyIdentifier
}

export interface ImportNamespaceSpecifier extends Expression {
  type: "ImportNamespaceSpecifier"
  local: AnyIdentifier
}

// ----- Export

export interface ExportSpecifier extends Expression {
  type: "ExportSpecifier"
  exported: AnyIdentifier
  local: AnyIdentifier
}

export interface ExportDefaultDeclaration extends Expression {
  type: "ExportDefaultDeclaration"
  declaration: Expression
}

export interface ExportAllDeclaration extends Expression {
  type: "ExportAllDeclaration"
  source: StringLiteral
  exported: AnyIdentifier | null
}

export interface ExportNamedDeclaration extends Statement {
  type: "ExportNamedDeclaration"
  specifiers: ExportSpecifier[]
  source: StringLiteral | null
  declaration: AnyDeclaration | null
}

// ----- Function

export interface FunctionDeclaration extends Statement {
  type: "FunctionDeclaration"
  id: AnyIdentifier
  params: Assignee[]
  async: boolean
  generator: boolean
  body: BlockStatement
}

// ----- Class

export interface ClassDeclaration extends Statement {
  type: "ClassDeclaration"
  id: AnyIdentifier
  extend: Expression | null
  body: ClassBody
}

export interface ClassBody extends Expression {
  type: "ClassBody"
  props: ClassProp[]
}

interface ClassVar extends Expression {
  id: AnyIdentifier
}

export interface ClassMethod extends ClassVar {
  type: "ClassMethod"
  params: Assignee[]
  body: BlockStatement
}

export interface ClassProperty extends ClassVar {
  type: "ClassProperty"
  init: Expression | null
}

// ===== STATEMENT =====

// ----- Flow

export interface ReturnStatement extends Statement {
  type: "ReturnStatement"
  node: Expression
}

export interface ThrowStatement extends Statement {
  type: "ThrowStatement"
  node: Expression
}

// ----- For Loop

export interface ForInStatement extends Statement {
  type: "ForInStatement"
  left: Expression
  right: Expression
  body: Consequent
}

export interface ForOfStatement extends Statement {
  type: "ForOfStatement"
  left: Expression
  right: Expression
  body: Consequent
  await: boolean
}

export interface ForStatement extends Statement {
  type: "ForStatement"
  init: Expression | null
  test: Expression | null
  update: Expression | null
  body: Consequent
}

// ----- While Loop

export interface DoWhileStatement extends Statement {
  type: "DoWhileStatement"
  test: Expression
  body: BlockStatement
}

export interface WhileStatement extends Statement {
  type: "WhileStatement"
  test: Expression
  body: Consequent
}

// ----- If Statement

export interface IfStatement extends Statement {
  type: "IfStatement"
  test: Expression
  consequent: Consequent
  alternate: IfStatement | Consequent | null
}

// ----- Try Statement

export interface TryStatement extends Statement {
  type: "TryStatement"
  block: BlockStatement
  handler: CatchClause | null
  finalizer: BlockStatement | null
}

export interface CatchClause extends Statement {
  type: "CatchClause"
  param: AnyIdentifier
  body: BlockStatement
}

// ----- Switch Statement

export interface SwitchStatement extends Statement {
  type: "SwitchStatement"
  discriminant: Expression
  cases: SwitchCase[]
}

export interface SwitchCase extends Expression {
  type: "SwitchCase"
  consequent: Consequent | null
  test: Expression | null
}

// ===== EXPRESSION =====

export interface TemplateStringExpression extends Expression {
	type: "TemplateStringExpression"
	quasi: TemplateStringLiteral
	tag: Expression
}

export interface CallExpression extends Expression {
  type: "CallExpression"
  args: Expression[]
  caller: Expression
  optional: boolean
}

// ----- Conditional Expression

export interface ConditionalExpression extends Statement {
  type: "ConditionalExpression"
  test: Expression
  consequent: Expression
  alternate: Expression
}

// ----- Binary

export interface AssignmentExpression extends Expression {
	type: "AssignmentExpression"
	operator: TokenType
	assigne: Expression
	value: Expression
}

export interface MemberExpression extends Expression {
	type: "MemberExpression"
  object: Expression
  property: Expression
  computed: boolean
  optional: boolean
}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression"
  kind: "add" | "mul" | "com"
	operator: TokenType
	left: Expression
	right: Expression
}

// ----- Pattern

export interface ArrayPattern extends Expression {
  type: "ArrayPattern"
  items: Expression[]
}

export interface PropertyPattern extends Property {
  type: "PropertyPattern"
  value: Assignee
}

export interface ObjectPattern extends Expression {
  type: "ObjectPattern"
  props: PropPattern[]
}

export interface Identifier extends Expression {
  type: "Identifier"
  symbol: string
}

export interface AssignmentPattern extends Expression {
  type: "AssignmentPattern"
  left: Assignee
  right: Expression
}

export interface RestElement extends ArgumentExpression {
  type: "RestElement"
}

export interface PrivateIdentifier extends Expression {
  type: "PrivateIdentifier"
  symbol: string
}

// ----- Complex

export interface BaseFunctionExpression extends Expression {
  async: boolean
  params: Assignee[]
}

export interface ClassExpression extends Expression {
  type: "ClassExpression"
  id: AnyIdentifier | null
  extend: Expression | null
  body: ClassBody
}

export interface FunctionExpression extends BaseFunctionExpression {
  type: "FunctionExpression"
  body: BlockStatement
  generator: boolean
  id: AnyIdentifier | null
}

export interface ArrowFunctionExpression extends BaseFunctionExpression {
  type: "ArrowFunctionExpression"
  expression: boolean
  body: BlockStatement | Expression
}

export interface ArrayExpression extends Expression {
  type: "ArrayExpression"
  items: Expression[]
}

export interface ObjectExpression extends Expression {
  type: "ObjectExpression"
  props: PropExpression[]
}

export interface Property extends Expression {
  key: Assignee
  kind: 'init'
  shorthand: boolean
  method: boolean
  computed: boolean
}

export interface PropertyExpression extends Property {
  type: "PropertyExpression"
  value: Expression
}

export interface TemplateStringLiteral extends Expression {
  type: "TemplateStringLiteral"
  expressions: Expression[]
  quasis: TemplateElement[]
}

export interface TemplateElement extends Expression {
  type: "TemplateElement"
  value: {
    cooked: string
    raw: string
  }
  tail: boolean
}

// ----- Primary

export interface ContinueStatement extends Statement {
  type: "ContinueStatement"
  label: AnyIdentifier | null
}

export interface BreakStatement extends Statement {
  type: "BreakStatement"
  label: AnyIdentifier | null
}

export interface UpdateExpression extends Expression {
  type: "UpdateExpression"
  argument: AnyIdentifier
  operator: TokenType
  prefix: boolean
}

export interface ArgumentExpression extends Expression {
  argument: Expression
}

export interface UnaryExpression extends ArgumentExpression {
  type: "UnaryExpression"
  operator: TokenType
  prefix: boolean
}

export interface SpreadElement extends ArgumentExpression {
  type: "SpreadElement"
}

export interface LabeledStatement extends Statement {
  type: "LabeledStatement"
  body: Expression
}

export interface NewExpression extends Expression {
	type: "NewExpression"
	caller: Expression
}

export interface AwaitExpression extends Expression {
	type: "AwaitExpression"
	node: Expression
}

export interface SequenceExpression extends Expression {
  type: "SequenceExpression"
  nodes: Expression[]
}

// ----- Literal

export interface NumericLiteral extends Expression {
  type: "NumericLiteral"
  raw: string
  value: number
  float: boolean
}

export interface RegExpLiteral extends Expression {
  type: "RegExpLiteral"
  raw: string
  value: {}
  regex: {
    pattern: string
    flags: string | null
  }
}

export interface StringLiteral extends Expression {
  type: "StringLiteral"
  value: string
  raw: string
}
