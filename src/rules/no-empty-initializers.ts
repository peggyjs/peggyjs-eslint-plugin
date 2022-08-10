import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import type { visitor } from "@peggyjs/eslint-parser";

function checkEmpty(
  context: Rule.RuleContext,
  node: visitor.AST.Initializer | visitor.AST.TopLevelInitializer
): void {
  const enode = n(node);
  if (node.code.value.replace(/\r?\n/g, "").trim() === "") {
    context.report({
      node: enode,
      messageId: "empty",
      fix(fixer: Rule.RuleFixer): Rule.Fix {
        return fixer.remove(enode);
      },
    });
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "top level initializer and per-instance initializer should not be empty if they are provided",
      recommended: true,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-empty-initializers.md",
    },
    messages: {
      empty: "Initializer must not be empty.",
    },
    fixable: "code",
    schema: [],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    return makeListener({
      top_level_initializer(node: visitor.AST.TopLevelInitializer): void {
        checkEmpty(context, node);
      },
      initializer(node: visitor.AST.Initializer): void {
        checkEmpty(context, node);
      },
    });
  },
};

export default rule;
