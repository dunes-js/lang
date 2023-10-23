
export interface Position {
	line: number,
	column: number
}


export type TknType<T extends string> = T | "EOF";
export type TagType<T extends string> = T | "WhiteSpace";