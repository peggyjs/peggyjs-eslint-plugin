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
            unusedImport: "Library import '{{ name }}' is never used.",
        },
        schema: [],
    },
    create(context) {
        const imports = new Map();
        const rules = new Map();
        const refs = new Set();
        const importRefs = new Set();
        return (0, utils_1.makeListener)({
            import_binding(node) {
                imports.set(node.binding.id.value, node);
            },
            import_binding_all(node) {
                imports.set(node.binding.id.value, node);
            },
            import_binding_default(node) {
                imports.set(node.binding.id.value, node);
            },
            import_binding_rename(node) {
                imports.set(node.binding.id.value, node);
            },
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
            library_ref(node) {
                importRefs.add(node.library.value);
            },
            "Program:exit": () => {
                for (const name of refs) {
                    rules.delete(name);
                    imports.delete(name);
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
                for (const name of importRefs) {
                    imports.delete(name);
                }
                for (const [name, r] of imports) {
                    context.report({
                        node: (0, utils_1.n)(r),
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
exports.default = rule;
