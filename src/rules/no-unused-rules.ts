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
      unusedImport: "Library import '{{ name }}' is never used.",
    },
    schema: [
      {
        type: "object",
        properties: {
          filter: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const imports = new Map<string, visitor.AST.Name>();
    const rules = new Map<string, visitor.AST.Rule>();
    const refs = new Set<string>();
    const importRefs = new Set<string>();
    const filter = context.options[0]?.filter;
    const match = filter ? new RegExp(filter) : undefined;

    return makeListener({
      import_binding(node: visitor.AST.ImportBinding): void {
        imports.set(node.binding.id.value, node.binding.id);
      },
      import_binding_all(node: visitor.AST.ImportBindingAll): void {
        imports.set(node.binding.id.value, node.binding.id);
      },
      import_binding_default(node: visitor.AST.ImportBindingDefault): void {
        imports.set(node.binding.id.value, node.binding.id);
      },
      import_binding_rename(node: visitor.AST.ImportBindingRename) {
        imports.set(node.binding.id.value, node.binding.id);
      },
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
      library_ref(node: visitor.AST.LibraryReferenceExpression): void {
        importRefs.add(node.library.value);
      },
      "Program:exit": (): void => {
        for (const name of refs) {
          rules.delete(name);
          imports.delete(name);
        }

        for (const [name, r] of rules) {
          if (match && !match.test(name)) {
            continue;
          }
          context.report({
            node: n(r),
            messageId: "unused",
            data: {
              name,
            },
          });
        }
        for (const name of importRefs) {
          imports.delete(name);
        }
        for (const [name, r] of imports) {
          context.report({
            node: n(r),
            messageId: "unusedImport",
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
