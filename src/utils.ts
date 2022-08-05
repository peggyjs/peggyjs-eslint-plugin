import type EStree from "estree";
import type { visitor } from "@peggyjs/eslint-parser";

// Typecast
export function n(node: visitor.AST.Node): EStree.Node {
  return node as unknown as EStree.Node;
}
