import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

function check(
  context: Rule.RuleContext,
  before: visitor.AST.Node,
  after: visitor.AST.Node,
  spaces = 0
): void {
  const beforeEnd = before.loc.end;
  const afterStart = after.loc.start;

  if (spaces < 0) {
    if ((afterStart.line > beforeEnd.line)
        || (afterStart.column >= beforeEnd.column + 1)) {
      return;
    }
  } else {
    if ((afterStart.line === beforeEnd.line)
        && (afterStart.column === beforeEnd.column + spaces)) {
      return;
    }
  }
  if (spaces > 0) {
    const src = context.getSourceCode();
    if (src.commentsExistBetween(n(before), n(after))) {
      return;
    }
  }
  context.report({
    loc: {
      start: beforeEnd,
      end: afterStart,
    },
    messageId: spaces ? "oneSpace" : "noSpaces",
    fix(fixer: Rule.RuleFixer): Rule.Fix {
      return fixer.replaceTextRange([
        before.range[1],
        after.range[0],
      ], "".padEnd(Math.abs(spaces)));
    },
  });
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce consistent spacing around operators",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/space-ops.md",
    },
    messages: {
      noSpaces: "No space allowed here",
      oneSpace: "One space required here",
    },
    fixable: "code",
    schema: [{
      type: "object",
      properties: {
        beforeSlash: {
          type: "number",
        },
      },
      additionalProperties: false,
    }],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const beforeSlash = Number(context.options[0]?.beforeSlash ?? -1);

    return makeListener({
      rule(node: visitor.AST.Rule): void {
        const expr = node.expression.type === "named"
          ? node.expression.expression
          : node.expression;
        check(context, node.equals, expr, 1);
      },
      one_or_more(node: visitor.AST.OneOrMoreExpression): void {
        check(context, node.expression, node.operator);
      },
      optional(node: visitor.AST.OptionalExpression): void {
        check(context, node.expression, node.operator);
      },
      zero_or_more(node: visitor.AST.ZeroOrMoreExpression): void {
        check(context, node.expression, node.operator);
      },
      semantic_and(node: visitor.AST.SemanticAndExpression): void {
        check(context, node.operator, node.code.open);
      },
      semantic_not(node: visitor.AST.SemanticNotExpression): void {
        check(context, node.operator, node.code.open);
      },
      simple_and(node: visitor.AST.SimpleAndExpression): void {
        check(context, node.operator, node.expression);
      },
      simple_not(node: visitor.AST.SimpleNotExpression): void {
        check(context, node.operator, node.expression);
      },
      text(node: visitor.AST.TextExpression): void {
        check(context, node.operator, node.expression);
      },
      choice(node: visitor.AST.ChoiceExpression): void {
        const typ = node.parent?.type;
        const ruleDirect = (typ === "rule") || (typ === "named");
        node.slashes.forEach((slash, i) => {
          check(context, slash, node.alternatives[i + 1], 1);
          if (!ruleDirect) {
            check(context, node.alternatives[i], slash, beforeSlash);
          }
        });
      },
    });
  },
};

export default rule;
