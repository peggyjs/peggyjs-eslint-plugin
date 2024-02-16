import type * as EStree from "estree";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";
export declare function n(node: visitor.AST.Node): EStree.Node;
type VisitorFunctionMap = ConstructorParameters<typeof visitor.Visitor<void>>[0];
export declare function makeListener(map: VisitorFunctionMap): Rule.RuleListener;
export declare function dirMap(...dirs: string[]): {
    [id: string]: object;
};
export {};
