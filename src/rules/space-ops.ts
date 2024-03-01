import { makeListener, n } from "../utils";
import type { Position } from "estree";
import type { Rule } from "eslint";
import assert from "assert";
import type { visitor } from "@peggyjs/eslint-parser";

interface Opts {
  messageId: string;
  start: Position;
  end: Position;
  range: [number, number];
  spaces: number;
}

function report(
  context: Rule.RuleContext,
  opts: Opts
): void {
  const asp = Math.abs(opts.spaces);
  context.report({
    loc: { start: opts.start, end: opts.end },
    messageId: opts.messageId,
    data: {
      num: String(asp),
      s: asp > 1 ? "s" : "",
    },
    fix(fixer: Rule.RuleFixer): Rule.Fix {
      return fixer.replaceTextRange(opts.range, "".padEnd(asp));
    },
  });
}

function check(
  context: Rule.RuleContext,
  before: visitor.AST.Node,
  after: visitor.AST.Node,
  spaces = 0
): void {
  const beforeEnd = before.loc.end;
  const afterStart = after.loc.start;
  let messageId: string | undefined = undefined;

  if (spaces < 0) {
    if ((afterStart.line > beforeEnd.line)
        || (afterStart.column >= beforeEnd.column - spaces)) {
      return;
    }
    messageId = "atLeast";
  } else {
    if ((afterStart.line === beforeEnd.line)
        && (afterStart.column === beforeEnd.column + spaces)) {
      // Works for or zero or more.
      return;
    }
    messageId = "noSpaces";  // May be reset below.
  }
  if (spaces > 0) {
    const src = context.getSourceCode();
    if (src.commentsExistBetween(n(before), n(after))) {
      return;
    }
    messageId = "exactSpace";
  }

  report(context, {
    messageId,
    start: beforeEnd,
    end: afterStart,
    range: [before.range[1], after.range[0]],
    spaces,
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
      exactSpace: "Exactly {{num}} space{{s}} required here",
      atLeast: "At least {{num}} space{{s}} required here",
    },
    fixable: "whitespace",
    schema: [{
      type: "object",
      properties: {
        afterAmp: { type: "number" },
        afterAt: { type: "number" },
        afterBang: { type: "number" },
        afterColon: { type: "number" },
        afterDollar: { type: "number" },
        afterEquals: { type: "number" },
        afterOpenParen: { type: "number" },
        afterSlash: { type: "number" },
        beforeCloseBrace: { type: "number" },
        beforeCloseParen: { type: "number" },
        beforeColon: { type: "number" },
        beforeOpenBrace: { type: "number" },
        beforePlus: { type: "number" },
        beforeQuestion: { type: "number" },
        beforeSlash: { type: "number" },
        beforeStar: { type: "number" },
      },
      additionalProperties: false,
    }],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const opts = {
      afterAmp: 0,
      afterAt: 0,
      afterBang: 0,
      afterColon: 0,
      afterDollar: 0,
      afterEquals: 1,
      afterOpenParen: -1,
      afterSlash: 1,
      beforeCloseBrace: -1,
      beforeCloseParen: -1,
      beforeColon: 0,
      beforeOpenBrace: -1,
      beforePlus: 0,
      beforeQuestion: 0,
      beforeSemi: 0,
      beforeSlash: -1,
      beforeStar: 0,
      ...context.options[0] as { [id: string]: number },
    };

    return makeListener({
      top_level_initializer(node: visitor.AST.TopLevelInitializer): void {
        if (node.semi && (node.semi.length > 0)) {
          check(context, node.close, node.semi[0], opts.beforeSemi);
        }
      },
      initializer(node: visitor.AST.Initializer): void {
        if (node.semi && (node.semi.length > 0)) {
          check(context, node.code.close, node.semi[0], opts.beforeSemi);
        }
      },
      rule(node: visitor.AST.Rule): void {
        const expr = node.expression.type === "named"
          ? node.expression.expression
          : node.expression;
        check(context, node.equals, expr, opts.afterEquals);
        if (node.semi && (node.semi.length > 0)) {
          check(context, expr, node.semi[0], opts.beforeSemi);
        }
      },
      action(node: visitor.AST.ActionExpression): void {
        check(context, node.expression, node.code.open, opts.beforeOpenBrace);
      },
      one_or_more(node: visitor.AST.OneOrMoreExpression): void {
        check(context, node.expression, node.operator, opts.beforePlus);
      },
      code(node: visitor.AST.Code): void {
        if (/\n$/.test(node.value)) {
          return;
        }
        const m = node.value.match(/ *$/);
        assert(m); // Should always match
        const trail = m[0].length;
        let messageId: string | undefined = undefined;
        const spaces = opts.beforeCloseBrace;
        if (spaces < 0) {
          if (trail >= -spaces) {
            return;
          }
          messageId = "atLeast";
        } else {
          if (trail === spaces) {
            return;
          }
          messageId = spaces ? "exactSpace" : "noSpaces";
        }
        report(context, {
          messageId,
          start: {
            line: node.loc.end.line,
            column: node.loc.end.column - trail,
          },
          end: node.loc.end,
          range: [node.range[1] - trail, node.range[1]],
          spaces,
        });
      },
      optional(node: visitor.AST.OptionalExpression): void {
        check(context, node.expression, node.operator, opts.beforeQuestion);
      },
      zero_or_more(node: visitor.AST.ZeroOrMoreExpression): void {
        check(context, node.expression, node.operator, opts.beforeStar);
      },
      semantic_and(node: visitor.AST.SemanticAndExpression): void {
        check(context, node.operator, node.code.open, opts.afterAmp);
      },
      semantic_not(node: visitor.AST.SemanticNotExpression): void {
        check(context, node.operator, node.code.open, opts.afterBang);
      },
      simple_and(node: visitor.AST.SimpleAndExpression): void {
        check(context, node.operator, node.expression, opts.afterAmp);
      },
      simple_not(node: visitor.AST.SimpleNotExpression): void {
        check(context, node.operator, node.expression, opts.afterBang);
      },
      text(node: visitor.AST.TextExpression): void {
        check(context, node.operator, node.expression, opts.afterDollar);
      },
      choice(node: visitor.AST.ChoiceExpression): void {
        const typ = node.parent?.type;
        const ruleDirect = (typ === "rule") || (typ === "named");
        node.slashes.forEach((slash, i) => {
          check(context, slash, node.alternatives[i + 1], opts.afterSlash);
          if (!ruleDirect) {
            check(context, node.alternatives[i], slash, opts.beforeSlash);
          }
        });
      },
      group(node: visitor.AST.GroupExpression): void {
        check(context, node.open, node.expression, opts.afterOpenParen);
        check(context, node.expression, node.close, opts.beforeCloseParen);
      },
      labeled(node: visitor.AST.LabeledExpression): void {
        if (node.pick) {
          if (node.name) {
            check(context, node.at, node.name, opts.afterAt);
          } else {
            check(context, node.at, node.expression, opts.afterAt);
          }
        }
        if (node.name) {
          check(context, node.name, node.colon, opts.beforeColon);
          check(context, node.colon, node.expression, opts.afterColon);
        }
      },
    });
  },
};

export = rule;
