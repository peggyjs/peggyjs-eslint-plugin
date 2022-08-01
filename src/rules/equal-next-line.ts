import type EStree from "estree";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "require rule equal signs to be on the next line from the rule name",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/equal-next-line.md",
    },
    messages: {
      next: "Equal sign must be on next line from the rule name.",
      same: "Equal sign must be on the same line as rule name.",
    },
    fixable: undefined,
    schema: [
      {
        title: "style",
        enum: ["always", "never"],
      },
      {
        title: "exceptions",
        type: "array",
        items: {
          type: "string",
          enum: ["choice", "named"],
        },
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const style = context.options[0] || "always";
    const exceptions = context.options[1] || [];

    return {
      // @ts-expect-error Peggy AST isn't expected by eslint
      rule(node: visitor.AST.Rule): void {
        const ruleLine = node.name.loc.start.line;
        const equalLine = node.equals.loc.start.line;

        switch (style) {
          case "always":
            if (ruleLine !== equalLine - 1) {
              context.report({
                node: node.equals as unknown as EStree.Node,
                messageId: "next",
              });
            }
            break;
          case "never": {
            let messageId: string | null = null;
            if (ruleLine === equalLine) {
              if (exceptions.includes(node.expression.type)) {
                // These go on the next line but they're not
                messageId = "next";
              }
            } else {
              if (exceptions.includes(node.expression.type)) {
                if (ruleLine !== equalLine - 1) {
                  // There's probably an extra blank line
                  messageId = "next";
                }
              } else {
                messageId = "same";
              }
            }
            if (messageId) {
              context.report({
                node: node.equals as unknown as EStree.Node,
                messageId,
              });
            }
            break;
          }
          /* c8 ignore start */
          // Schema prevents unknown styles.
          default:
            throw new Error(`Unknown style: '${style}'`);
          /* c8 ignore stop */
        }
      },
    };
  },
};

export default rule;
