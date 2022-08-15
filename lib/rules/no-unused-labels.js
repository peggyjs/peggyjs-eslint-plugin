"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "labels may not be used without either an action or a semantic predicate to reference them",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/no-unused-labels.md",
        },
        messages: {
            unused: "Label '{{ name }}' is never used.",
        },
        fixable: "code",
        schema: [],
    },
    create(context) {
        return (0, utils_1.makeListener)({
            labeled(node) {
                function report() {
                    context.report({
                        node: (0, utils_1.n)(node.name),
                        messageId: "unused",
                        data: { name: node.name.value },
                        fix(fixer) {
                            return fixer.removeRange([
                                node.range[0],
                                node.expression.range[0],
                            ]);
                        },
                    });
                }
                if (!node.name) { // Pluck
                    return;
                }
                let p = node.parent;
                while (p) {
                    switch (p.type) {
                        case "action":
                            // We are in an action block, so no-unused-vars will handle if the
                            // label isn't used.
                            return;
                        case "group": {
                            // We are inside a group, and weren't used by an action.
                            report();
                            return;
                        }
                        case "rule": {
                            // We are inside a block, but not an action
                            report();
                            return;
                        }
                        case "choice": {
                            // This case might be caught by the others, but let's make it
                            // explicit.  We got to a choice before an action or a predicate
                            // sequence.
                            report();
                            return;
                        }
                        case "sequence": {
                            // We are in a sequence.  If a sibling is a semantic predicate,
                            // we're ok.  Otherwise, we may have an issue.
                            for (const e of p.elements) {
                                if (e.type.startsWith("semantic_")) {
                                    return;
                                }
                            }
                            break;
                        }
                        // I *think* this isn't possible with the current grammar.
                        /* c8 ignore start */
                        default:
                            break;
                        /* c8 ignore stop */
                    }
                    p = p.parent;
                }
            },
        });
    },
};
exports.default = rule;
