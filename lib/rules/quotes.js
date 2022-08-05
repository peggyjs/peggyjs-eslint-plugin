"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function checkQuotes(context, style, avoidEscape, node) {
    if (style === "double") {
        if (node.before.value !== '"') {
            // Use raw here, since we want to output exactly what was there before,
            // without having to re-escape.
            let escaped = node.raw;
            if (escaped.includes('"')) {
                if (avoidEscape) {
                    return;
                }
                escaped = escaped.replace(/"/g, '\\"');
            }
            context.report({
                node: (0, utils_1.n)(node),
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                fix(fixer) {
                    return fixer.replaceText((0, utils_1.n)(node), `"${escaped}"`);
                },
            });
        }
    }
    else {
        if (node.before.value !== "'") {
            let escaped = node.raw;
            if (node.value.includes("'")) {
                if (avoidEscape) {
                    return;
                }
                escaped = escaped.replace(/'/g, "\\'");
            }
            context.report({
                node: (0, utils_1.n)(node),
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                fix(fixer) {
                    return fixer.replaceText((0, utils_1.n)(node), `'${escaped}'`);
                },
            });
        }
    }
}
const rule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "enforce the consistent use of double or single quotes",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/quotes.md",
        },
        messages: {
            wrongQuotes: "Strings must use {{description}}.",
        },
        fixable: "code",
        schema: [
            {
                enum: ["single", "double"],
            },
            {
                type: "object",
                properties: {
                    avoidEscape: {
                        type: "boolean",
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const style = context.options[0] || "double";
        const opts = {
            avoidEscape: true,
            ...context.options[1],
        };
        return {
            // @ts-expect-error Peggy AST isn't expected by eslint
            display(node) {
                checkQuotes(context, style, opts.avoidEscape, node);
            },
            // @ts-expect-error Peggy AST isn't expected by eslint
            literal(node) {
                checkQuotes(context, style, opts.avoidEscape, node);
            },
        };
    },
};
exports.default = rule;
