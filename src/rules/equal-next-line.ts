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
        enum: ["always", "never", "choice"],
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const style = context.options[0] || "choice";
    return {
      // @ts-expect-error Peggy AST isn't expected by eslint
      "rule": (node: visitor.AST.Rule): void => {
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
          case "never":
            if (ruleLine !== equalLine) {
              context.report({
                node: node.equals as unknown as EStree.Node,
                messageId: "same",
              });
            }
            break;
          case "choice":
            if (node.expression.type === "choice") {
              if (ruleLine !== equalLine - 1) {
                context.report({
                  node: node.equals as unknown as EStree.Node,
                  messageId: "next",
                });
              }
            } else {
              if (ruleLine !== equalLine) {
                context.report({
                  node: node.equals as unknown as EStree.Node,
                  messageId: "same",
                });
              }
            }
            break;
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
