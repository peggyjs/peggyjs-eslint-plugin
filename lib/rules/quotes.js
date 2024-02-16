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
                oneOf: [
                    {
                        type: "object",
                        properties: {
                            avoidEscape: {
                                type: "boolean",
                            },
                            style: {
                                type: "string",
                                enum: ["single", "double"],
                            },
                        },
                        additionalProperties: false,
                    },
                    {
                        title: "style",
                        type: "string",
                        enum: ["single", "double"],
                    },
                ],
            },
        ],
    },
    create(context) {
        const optObj = (typeof context.options[0] === "string")
            ? { style: context.options[0] }
            : context.options[0];
        const opts = {
            avoidEscape: true,
            style: "double",
            ...optObj,
        };
        return (0, utils_1.makeListener)({
            display(node) {
                checkQuotes(context, opts.style, opts.avoidEscape, node);
            },
            literal(node) {
                checkQuotes(context, opts.style, opts.avoidEscape, node);
            },
            import_module_specifier(node) {
                checkQuotes(context, opts.style, opts.avoidEscape, node);
            },
            module_export_name(node) {
                checkQuotes(context, opts.style, opts.avoidEscape, node);
            },
        });
    },
};
exports.default = rule;
