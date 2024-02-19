"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enhanced_resolve_1 = require("enhanced-resolve");
const utils_1 = require("../utils");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const fs = new enhanced_resolve_1.CachedInputFileSystem(node_fs_1.default, 30 * 1000);
const hasExports = /^\s*(peg\$parse\s+as\s+parse|parse:\s+peg\$parse)/m;
const allowedStartESM = /^\s*const peg\$allowedStartRules\s*=\s*(\[[^\]]+\]);/m;
//   StartRules: ["foo"],
const allowedStartCJS = /^\s*StartRules: (\[[^\r\n\]]+\])/m;
const rule = {
    meta: {
        type: "problem",
        docs: {
            description: "All imports must point to correct JS files, compiled by Peggy 4.0.0 or later, which export the expected rule name as an allowedStartRule.",
            recommended: true,
            url: "https://github.com/peggyjs/peggyjs-eslint-plugin/blob/main/docs/rules/valid-imports.md",
        },
        messages: {
            importNotFound: "Import '{{import}}' not found",
            importNotParser: "Import '{{import}}' does not contain a parser",
            importBadVersion: "Import '{{import}}' was not compiled by peggy 4.0 or later",
            importBadExport: "Import '{{import}}' does not export a rule called '{{export}}'",
            importDuplicate: "Import '{{import}}' is a duplicate name '{{name}}'",
            importNameNotFound: "Import '{{name}}' was not found",
        },
        schema: [{
                type: "object",
                properties: {
                    format: { enum: ["es", "commonjs", "guess"] },
                },
            }],
    },
    create(context) {
        const resolver = enhanced_resolve_1.ResolverFactory.createResolver({
            fileSystem: fs,
            useSyncFileSystemCalls: true,
        });
        const modules = new WeakMap();
        const libs = {};
        return (0, utils_1.makeListener)({
            import_module_specifier(node) {
                let contents = null;
                try {
                    const res = resolver.resolveSync({}, node_path_1.default.dirname(context.physicalFilename), node.value);
                    if (res) {
                        contents = fs.readFileSync(res, { encoding: "utf8" });
                    }
                }
                catch (_err) {
                    // Ignore
                    // console.log(_err);
                }
                if (!contents) {
                    context.report({
                        loc: {
                            start: node.before.loc.end,
                            end: node.after.loc.start,
                        },
                        messageId: "importNotFound",
                        data: {
                            import: node.value,
                        },
                    });
                    return;
                }
                // The jankiest version of require|import, so that we don't actually
                // have to load and parse the JS, which might have been a security issue.
                const parse = contents.match(hasExports);
                if (!parse) {
                    context.report({
                        loc: {
                            start: node.before.loc.end,
                            end: node.after.loc.start,
                        },
                        messageId: "importNotParser",
                        data: {
                            import: node.value,
                        },
                    });
                    return;
                }
                let startRules = undefined;
                if (parse[1].startsWith("peg$")) {
                    // ESM
                    startRules = contents.match(allowedStartESM)?.[1];
                }
                else {
                    // CJS
                    startRules = contents.match(allowedStartCJS)?.[1];
                }
                if (!startRules) {
                    context.report({
                        loc: {
                            start: node.before.loc.end,
                            end: node.after.loc.start,
                        },
                        messageId: "importBadVersion",
                        data: {
                            import: node.value,
                        },
                    });
                    return;
                }
                let mods = undefined;
                try {
                    mods = JSON.parse(startRules);
                }
                catch {
                    // Ignored
                }
                if (!mods
                    || !Array.isArray(mods)
                    || mods.length === 0
                    || mods.some(v => (typeof v !== "string") || (v.length === 0))) {
                    context.report({
                        loc: {
                            start: node.before.loc.end,
                            end: node.after.loc.start,
                        },
                        messageId: "importNotParser",
                        data: {
                            import: node.value,
                        },
                    });
                    return;
                }
                modules.set(node, new Set(mods));
            },
            "grammar_import:exit": (node) => {
                const mods = modules.get(node.from);
                if (!mods) {
                    // There was a problem above.
                    return;
                }
                for (const what of node.what) {
                    // eslint-disable-next-line default-case
                    switch (what.type) {
                        case "import_binding":
                            if (!mods.has(what.binding.id.value)) {
                                context.report({
                                    loc: what.binding.id.loc,
                                    messageId: "importBadExport",
                                    data: {
                                        "import": node.from.value,
                                        "export": what.binding.id.value,
                                    },
                                });
                            }
                            break;
                        case "import_binding_all":
                            // Leave this to the library_ref rule
                            if (libs[what.binding.id.value]) {
                                context.report({
                                    loc: what.binding.id.loc,
                                    messageId: "importDuplicate",
                                    data: {
                                        "import": node.from.value,
                                        "name": what.binding.id.value,
                                    },
                                });
                            }
                            else {
                                libs[what.binding.id.value] = mods;
                            }
                            break;
                        case "import_binding_default":
                            // There is always a default rule
                            break;
                        case "import_binding_rename": {
                            if (!mods.has(what.rename.value)) {
                                context.report({
                                    loc: what.binding.id.loc,
                                    messageId: "importBadExport",
                                    data: {
                                        "import": node.from.value,
                                        "export": what.rename.value,
                                    },
                                });
                            }
                            break;
                        }
                    }
                }
            },
            library_ref(node) {
                const mods = libs[node.library.value];
                if (!mods) {
                    context.report({
                        loc: node.library.loc,
                        messageId: "importNameNotFound",
                        data: {
                            "export": node.library.value,
                        },
                    });
                }
                else if (!mods.has(node.name.value)) {
                    context.report({
                        loc: node.name.loc,
                        messageId: "importNameNotFound",
                        data: {
                            name: node.name.value,
                        },
                    });
                }
            },
        });
    },
};
exports.default = rule;
