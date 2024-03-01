import type * as EStree from "estree";
import type { Rule } from "eslint";
import fs from "fs";
import path from "path";
import type { visitor } from "@peggyjs/eslint-parser";

// Typecast
export function n(node: visitor.AST.Node): EStree.Node {
  return node as unknown as EStree.Node;
}

type VisitorFunctionMap
  = ConstructorParameters<typeof visitor.Visitor<void>>[0];

export function makeListener(map: VisitorFunctionMap): Rule.RuleListener {
  return map as unknown as Rule.RuleListener;
}

export function dirMap(...dirs: string[]): { [id: string]: object } {
  const dirName = path.join(...dirs);
  return Object.fromEntries(
    fs
      .readdirSync(dirName)
      .filter(fileName => fileName.endsWith(".js") && !fileName.startsWith("."))
      .map(fileName => fileName.replace(/\.js$/, ""))
      .map(entryName => [
        entryName,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require(path.join(dirName, entryName)),
      ])
  );
}
