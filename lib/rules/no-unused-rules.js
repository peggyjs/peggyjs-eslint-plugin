"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
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
    create(context) {
        const rules = new Map();
        const refs = new Set();
        return {
            // @ts-expect-error Peggy AST isn't expected by eslint
            rule(node) {
                if (rules.size === 0) {
                    // Default start rule counts as a reference.
                    refs.add(node.name.value);
                }
                rules.set(node.name.value, node);
            },
            // @ts-expect-error Peggy AST isn't expected by eslint
            rule_ref(node) {
                refs.add(node.name.value);
            },
            "Program:exit": () => {
                for (const name of refs) {
                    rules.delete(name);
                }
                for (const [name, r] of rules) {
                    const node = r;
                    context.report({
                        node,
                        messageId: "unused",
                        data: {
                            name,
                        },
                    });
                }
            },
        };
    },
};
exports.default = rule;
