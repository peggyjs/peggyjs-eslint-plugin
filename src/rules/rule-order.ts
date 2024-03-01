import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import assert from "assert";
import type { visitor } from "@peggyjs/eslint-parser";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Rule definitions should come after all references to that rule, unless there is a rule loop",
      recommended: false,
      url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/rule-oder.md",
    },
    messages: {
      order: "Rule '{{name}}' must be defined after reference.",
    },
    schema: [],
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const rules = new Map<string, [visitor.AST.Name[], visitor.AST.Rule]>();
    let curRule: visitor.AST.Rule | null = null;
    function chase(
      refs: visitor.AST.Name[], rulName: string, checked: Set<string>
    ): boolean {
      return refs.some(r => {
        const nam = r.value;
        if (nam === rulName) {
          return true;
        }
        if (checked.has(nam)) {
          return false;
        }
        checked.add(nam);
        const [subrefs] = rules.get(nam) || [[]];
        return chase(subrefs, rulName, checked);
      });
    }
    return makeListener({
      rule(node: visitor.AST.Rule): void {
        curRule = node;
        rules.set(node.name.value, [[], node]);
      },
      rule_ref(node: visitor.AST.RuleReferenceExpression): void {
        const name = curRule?.name.value;
        assert(name);
        rules.get(name)?.[0]?.push(node.name);
      },
      "Program:exit": (): void => {
        for (const [rulName, [refs]] of rules) {
          for (const ref of refs) {
            const [refRefs, refRul] = rules.get(ref.value) ?? [[], null];
            if (refRul && ref.loc.start.line >= refRul.loc.start.line) {
              // This rule references itself
              if (rulName === ref.value) {
                continue;
              }
              // Is there a reference back to this rule from a loop?
              if (chase(refRefs, rulName, new Set<string>())) {
                continue;
              }
              context.report({
                node: n(ref),
                messageId: "order",
                data: { name: ref.value },
              });
            }
          }
        }
      },
    });
  },
};

export = rule;
