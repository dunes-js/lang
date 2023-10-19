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

  | "ImportDeclaration"
  | "ImportSpecifier"
  | "ImportDefaultSpecifier"
  | "ImportNamespaceSpecifier"

  // | "ExportDeclaration"
  // | "ExportSpecifier"
  // | "ExportDefaultSpecifier"
  // | "ExportNamespaceSpecifier"


	| "BinaryExpression"
  | "CallExpression"
  | "AssignmentExpression"
  | "MemberExpression"
  | "SequenceExpression"
  
  | "BlockComment"
  | "LineComment"
  | "DocComment"

  | "ObjectExpression"
  | "ObjectPattern"
  
  | "ArrayExpression"
  | "ArrayPattern"
  | "AssignmentPattern"
  | "EmptyExpression"

	| "NumericLiteral"
	| "Property"
	| "Parameter"
	| "StringLiteral"
	| "Identifier"
  | "UnaryExpression"
  
  | "UpdateExpression"
  | "ForInStatement"
	| "ForOfStatement"
  | "ForStatement"

  | "SwitchStatement"
  | "SwitchCase"
  
  | "ClassBody"
  | "ClassMethod"
  | "ClassProperty"

	| "FunctionExpression"
  | "ArrowFunctionExpression"

  | "ReturnStatement"
  | "ThrowStatement"
	| "NewExpression"
  | "AwaitExpression"
	| "TypeOfExpression"
	| "InstanceOfExpression"
	| "VoidStatement"
  | "ExpressionStatement"
)

export type AnyNode = (
  | FunctionDeclaration
  | ClassDeclaration
  | FunctionDeclaration
  | VariableDeclaration
  | BlockStatement
  | IfStatement

  | BinaryExpression
  | CallExpression
  | AssignmentExpression
  | MemberExpression
  | SequenceExpression
  
  | BlockComment
  | LineComment
  | DocComment
  | EmptyExpression

  | ImportDeclaration
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier

  // | ExportDeclaration
  // | ExportSpecifier
  // | ExportDefaultSpecifier
  // | ExportNamespaceSpecifier
  | UpdateExpression
  | UnaryExpression
  | ForInStatement
  | ForOfStatement
  | ForStatement

  | ArrayExpression
  | ObjectExpression
  | NumericLiteral
  | Property
  | Parameter
  | StringLiteral
  | Identifier
  
  | AssignmentPattern
  | ArrayPattern
  
  | ClassBody
  | ClassMethod
  | ClassProperty

  | FunctionExpression
  | ArrowFunctionExpression
  | ExpressionStatement

  | SwitchStatement
  | SwitchCase

  | ReturnStatement
  | ThrowStatement
  | NewExpression
  | AwaitExpression
  | TypeOfExpression
  | InstanceOfExpression
  | VoidStatement
)

export type AnyImportSpecifier = (
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
)

// export type AnyExportSpecifier = (
//   | ExportSpecifier
//   | ExportDefaultSpecifier
//   | ExportNamespaceSpecifier
// )

export type Assignee = (
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | AssignmentPattern
)

export type AnyFor = (
  | ForStatement
  | ForOfStatement
  | ForInStatement
)

export type Init = (
  | Expression
  | null
)

export type ClassProps = (
  | ClassMethod 
  | ClassProperty
)

export type Consequent = (
  | BlockStatement 
  | ExpressionStatement
  | EmptyExpression
)

export interface NodeTypes extends parser.NodesObj {
	VariableDeclaration: VariableDeclaration
  VariableDeclarator: VariableDeclarator
	FunctionDeclaration: FunctionDeclaration
	ClassDeclaration: ClassDeclaration
	BlockStatement: BlockStatement
  ExpressionStatement: ExpressionStatement
	IfStatement: IfStatement

  ImportDeclaration: ImportDeclaration
  ImportSpecifier: ImportSpecifier
  ImportDefaultSpecifier: ImportDefaultSpecifier
  ImportNamespaceSpecifier: ImportNamespaceSpecifier

  // ExportDeclaration: ExportDeclaration
  // ExportSpecifier: ExportSpecifier
  // ExportDefaultSpecifier: ExportDefaultSpecifier
  // ExportNamespaceSpecifier: ExportNamespaceSpecifier

  UpdateExpression: UpdateExpression
  UnaryExpression: UnaryExpression
  ForInStatement: ForInStatement
  ForOfStatement: ForOfStatement
  ForStatement: ForStatement

  BinaryExpression: BinaryExpression
  SequenceExpression: SequenceExpression
  CallExpression: CallExpression
  AssignmentExpression: AssignmentExpression
  MemberExpression: MemberExpression

  Identifier: Identifier
	NumericLiteral: NumericLiteral
  StringLiteral: StringLiteral
	
  ArrayExpression: ArrayExpression
	ObjectExpression: ObjectExpression
	Property: Property
	
  SwitchStatement: SwitchStatement
  SwitchCase: SwitchCase

  AssignmentPattern: AssignmentPattern
	Parameter: Parameter
	ArrayPattern: ArrayPattern
  ObjectPattern: ObjectPattern
  
  ClassBody: ClassBody
  ClassMethod: ClassMethod
	ClassProperty: ClassProperty

	BlockComment: BlockComment
	LineComment: LineComment
	DocComment: DocComment

	FunctionExpression: FunctionExpression
  ArrowFunctionExpression: ArrowFunctionExpression

  ReturnStatement: ReturnStatement
  ThrowStatement: ThrowStatement
  EmptyExpression: EmptyExpression
	NewExpression: NewExpression
  AwaitExpression: AwaitExpression
	TypeOfExpression: TypeOfExpression
	InstanceOfExpression: InstanceOfExpression
	VoidStatement: VoidStatement
}

export interface Expression extends parser.Node<NodeType> {}

export interface Statement extends Expression {}

export interface ExpressionStatement extends Statement {
	type: "ExpressionStatement"
	expression: Expression;
}

export interface BlockStatement extends Statement {
  type: "BlockStatement"
  body: Expression[];
}

export interface UpdateExpression extends Expression {
  type: "UpdateExpression"
  argument: Identifier
  operator: TokenType
  prefix: boolean
}

export interface UnaryExpression extends Expression {
  type: "UnaryExpression"
  argument: Expression
  operator: TokenType
  prefix: boolean
}

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

export interface IfStatement extends Statement {
  type: "IfStatement"
  test: Expression
  consequent: Consequent
  alternate: IfStatement | Consequent | null
}

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

export interface VariableDeclaration extends Statement {
	type: "VariableDeclaration"
	kind: "Var" | "Let" | "Const"
	declarators: VariableDeclarator[]
}

export interface VariableDeclarator extends Expression {
  type: "VariableDeclarator"
  id: Assignee
  init: Init
}

export interface ImportDeclaration extends Statement {
	type: "ImportDeclaration"
	specifiers: AnyImportSpecifier[]
  source: StringLiteral
}

export interface ImportSpecifier extends Expression {
  type: "ImportSpecifier"
  imported: Identifier
  local: Identifier
}

export interface ImportDefaultSpecifier extends Expression {
  type: "ImportDefaultSpecifier"
  local: Identifier
}

export interface ImportNamespaceSpecifier extends Expression {
  type: "ImportNamespaceSpecifier"
  local: Identifier
}

// export interface ExportDeclaration extends Statement {
//   type: "ExportDeclaration"
//   specifiers: AnyExportSpecifier[]
// }

// export interface ExportSpecifier extends Expression {
//   type: "ExportSpecifier"
//   imported: Identifier
//   local: Identifier
// }

// export interface ExportDefaultSpecifier extends Expression {
//   type: "ExportDefaultSpecifier"
//   local: Identifier
// }

// export interface ExportNamespaceSpecifier extends Expression {
//   type: "ExportNamespaceSpecifier"
//   local: Identifier
// }

export interface FunctionDeclaration extends Statement {
  type: "FunctionDeclaration"
  id: Identifier
  params: Parameter[]
  async: boolean
  generator: boolean
  body: BlockStatement
}

export interface ClassDeclaration extends Statement {
	type: "ClassDeclaration"
	id: Identifier
	extend: Init
	body: ClassBody
}

export interface ClassBody extends Expression {
  type: "ClassBody"
  props: ClassProps[]
}

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


interface ClassVar extends Expression {
	private: boolean
	id: Identifier // | ComputedValue
}


export interface ClassMethod extends ClassVar {
	type: "ClassMethod"
	params: Parameter[]
	body: BlockStatement
}

export interface ClassProperty extends ClassVar {
	type: "ClassProperty"
	init: Init
}

export interface CallExpression extends Expression {
	type: "CallExpression"
	args: Expression[]
	caller: Expression
}

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
}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression"
  kind: "add" | "mul" | "com"
	operator: TokenType
	left: Expression
	right: Expression
}

export interface NumericLiteral extends Expression {
	type: "NumericLiteral"
	raw: string
	value: number
	float: boolean
}

export interface StringLiteral extends Expression {
	type: "StringLiteral"
	content: string
	quotes: "Single" | "Double"
}

export interface Identifier extends Expression {
	type: "Identifier"
	symbol: string
}

export interface ArrayExpression extends Expression {
	type: "ArrayExpression"
	items: Expression[]
}

export interface ArrayPattern extends Expression {
  type: "ArrayPattern"
  items: Expression[]
}

export interface ObjectExpression extends Expression {
	type: "ObjectExpression"
	props: Property[]
}


export interface ObjectPattern extends Expression {
  type: "ObjectPattern"
  props: Property[]
}

export interface Property extends Expression {
	type: "Property"
	key: PropertyKey
	init: Init
}

export interface Parameter extends Expression {
	type: "Parameter"
	spread: boolean
	id: Assignee
	init: Init
}

export interface ReturnStatement extends Statement {
	type: "ReturnStatement"
	node: Expression
}

export interface ThrowStatement extends Statement {
  type: "ThrowStatement"
  node: Expression
}

export interface VoidStatement extends Statement {
  type: "VoidStatement"
  node: Expression
}

export interface NewExpression extends Expression {
	type: "NewExpression"
	node: Expression
}

export interface AwaitExpression extends Expression {
	type: "AwaitExpression"
	node: Expression
}

export interface TypeOfExpression extends Expression {
  type: "TypeOfExpression"
  node: Expression
}

export interface InstanceOfExpression extends Expression {
	type: "InstanceOfExpression"
	node: Expression
}

export interface AssignmentPattern extends Expression {
  type: "AssignmentPattern"
  operator: TokenType
  left: Assignee
  right: Expression
}

export interface SequenceExpression extends Expression {
  type: "SequenceExpression"
  nodes: Expression[]
}

export interface BaseFunctionExpression extends Expression {
  async: boolean
  params: Parameter[]
}

export interface FunctionExpression extends BaseFunctionExpression {
  type: "FunctionExpression"
  body: BlockStatement
  generator: boolean
  id: Identifier | null
}

export interface ArrowFunctionExpression extends BaseFunctionExpression {
  type: "ArrowFunctionExpression"
  expression: boolean
  body: BlockStatement | Expression

}




export interface EmptyExpression extends Expression {
  type: "EmptyExpression"
}