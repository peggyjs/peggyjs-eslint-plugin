import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "all rules except for the first one must be referenced by another rule",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-unused-rules.md",
    },
    messages: {
      unused: "Rule '{{ name }}' is never used.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const rules = new Map<string, visitor.AST.Rule>();
    const refs = new Set<string>();
    return makeListener({
      rule(node: visitor.AST.Rule): void {
        if (rules.size === 0) {
          // Default start rule counts as a reference.
          refs.add(node.name.value);
        }
        rules.set(node.name.value, node);
      },
      rule_ref(node: visitor.AST.RuleReferenceExpression): void {
        refs.add(node.name.value);
      },
      "Program:exit": (): void => {
        for (const name of refs) {
          rules.delete(name);
        }
        for (const [name, r] of rules) {
          context.report({
            node: n(r),
            messageId: "unused",
            data: {
              name,
            },
          });
        }
      },
    });
  },
};

export default rule;
