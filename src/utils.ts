import type EStree from "estree";
import type { Rule } from "eslint";
import fs from "fs";
import path from "path";
import type { visitor } from "@peggyjs/eslint-parser";

// Typecast
export function n(node: visitor.AST.Node): EStree.Node {
  return node as unknown as EStree.Node;
}

type VisitorFunction<T extends visitor.AST.Node> =
  (node: T) => void;

export interface VisitorFunctionMap {
  Program?: VisitorFunction<visitor.AST.Program>;
  grammar?: VisitorFunction<visitor.AST.Grammar>;
  top_level_initializer?: VisitorFunction<visitor.AST.TopLevelInitializer>;
  initializer?: VisitorFunction<visitor.AST.Initializer>;
  rule?: VisitorFunction<visitor.AST.Rule>;
  named?: VisitorFunction<visitor.AST.NamedExpression>;
  choice?: VisitorFunction<visitor.AST.ChoiceExpression>;
  action?: VisitorFunction<visitor.AST.ActionExpression>;
  sequence?: VisitorFunction<visitor.AST.SequenceExpression>;
  labeled?: VisitorFunction<visitor.AST.LabeledExpression>;
  text?: VisitorFunction<visitor.AST.TextExpression>;
  simple_and?: VisitorFunction<visitor.AST.SimpleAndExpression>;
  simple_not?: VisitorFunction<visitor.AST.SimpleNotExpression>;
  optional?: VisitorFunction<visitor.AST.OptionalExpression>;
  zero_or_more?: VisitorFunction<visitor.AST.ZeroOrMoreExpression>;
  one_or_more?: VisitorFunction<visitor.AST.OneOrMoreExpression>;
  group?: VisitorFunction<visitor.AST.GroupExpression>;
  semantic_and?: VisitorFunction<visitor.AST.SemanticAndExpression>;
  semantic_not?: VisitorFunction<visitor.AST.SemanticNotExpression>;
  rule_ref?: VisitorFunction<visitor.AST.RuleReferenceExpression>;
  literal?: VisitorFunction<visitor.AST.LiteralExpression>;
  display?: VisitorFunction<visitor.AST.DisplayName>;
  class?: VisitorFunction<visitor.AST.ClassExpression>;
  any?: VisitorFunction<visitor.AST.AnyExpression>;
  name?: VisitorFunction<visitor.AST.NamedExpression>;
  code?: VisitorFunction<visitor.AST.Code>;
  punc?: VisitorFunction<visitor.AST.Punctuation>;
  Block?: VisitorFunction<visitor.AST.BlockComment>;
  Line?: VisitorFunction<visitor.AST.LineComment>;
  "*"?: VisitorFunction<visitor.AST.Node>;

  "Program:exit"?: VisitorFunction<visitor.AST.Program>;
  "grammar:exit"?: VisitorFunction<visitor.AST.Grammar>;
  "top_level_initializer:exit"?: VisitorFunction<visitor.AST.TopLevelInitializer>;
  "initializer:exit"?: VisitorFunction<visitor.AST.Initializer>;
  "rule:exit"?: VisitorFunction<visitor.AST.Rule>;
  "named:exit"?: VisitorFunction<visitor.AST.NamedExpression>;
  "choice:exit"?: VisitorFunction<visitor.AST.ChoiceExpression>;
  "action:exit"?: VisitorFunction<visitor.AST.ActionExpression>;
  "sequence:exit"?: VisitorFunction<visitor.AST.SequenceExpression>;
  "labeled:exit"?: VisitorFunction<visitor.AST.LabeledExpression>;
  "text:exit"?: VisitorFunction<visitor.AST.TextExpression>;
  "simple_and:exit"?: VisitorFunction<visitor.AST.SimpleAndExpression>;
  "simple_not:exit"?: VisitorFunction<visitor.AST.SimpleNotExpression>;
  "optional:exit"?: VisitorFunction<visitor.AST.OptionalExpression>;
  "zero_or_more:exit"?: VisitorFunction<visitor.AST.ZeroOrMoreExpression>;
  "one_or_more:exit"?: VisitorFunction<visitor.AST.OneOrMoreExpression>;
  "group:exit"?: VisitorFunction<visitor.AST.GroupExpression>;
  "semantic_and:exit"?: VisitorFunction<visitor.AST.SemanticAndExpression>;
  "semantic_not:exit"?: VisitorFunction<visitor.AST.SemanticNotExpression>;
  "rule_ref:exit"?: VisitorFunction<visitor.AST.RuleReferenceExpression>;
  "literal:exit"?: VisitorFunction<visitor.AST.LiteralExpression>;
  "display:exit"?:  VisitorFunction<visitor.AST.DisplayName>;
  "class:exit"?: VisitorFunction<visitor.AST.ClassExpression>;
  "any:exit"?: VisitorFunction<visitor.AST.AnyExpression>;
  "name:exit"?: VisitorFunction<visitor.AST.NamedExpression>;
  "code:exit"?: VisitorFunction<visitor.AST.Code>;
  "punc:exit"?: VisitorFunction<visitor.AST.Punctuation>;
  "Block:exit"?: VisitorFunction<visitor.AST.BlockComment>;
  "Line:exit"?: VisitorFunction<visitor.AST.LineComment>;
  "*:exit"?: VisitorFunction<visitor.AST.Node>;
}

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
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        require(path.join(dirName, entryName)).default,
      ])
  );
}
