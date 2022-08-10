"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
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
        return (0, utils_1.makeListener)({
            rule(node) {
                if (rules.size === 0) {
                    // Default start rule counts as a reference.
                    refs.add(node.name.value);
                }
                rules.set(node.name.value, node);
            },
            rule_ref(node) {
                refs.add(node.name.value);
            },
            "Program:exit": () => {
                for (const name of refs) {
                    rules.delete(name);
                }
                for (const [name, r] of rules) {
                    context.report({
                        node: (0, utils_1.n)(r),
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
exports.default = rule;
