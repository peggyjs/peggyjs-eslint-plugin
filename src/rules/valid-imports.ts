import { CachedInputFileSystem, ResolverFactory } from "enhanced-resolve";
import { makeListener, n } from "../utils";
import type { Rule } from "eslint";
import nfs from "node:fs";
import path from "node:path";
import type { visitor } from "@peggyjs/eslint-parser";

const fs = new CachedInputFileSystem(nfs, 30 * 1000);
const hasExports = /^\s*(peg\$parse\s+as\s+parse|parse:\s+peg\$parse)/m;
const allowedStartESM = /^\s*const peg\$allowedStartRules\s*=\s*(\[[^\]]+\]);/m;
//   StartRules: ["foo"],
const allowedStartCJS = /^\s*StartRules: (\[[^\r\n\]]+\])/m;

const rule: Rule.RuleModule = {
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
  create(context: Rule.RuleContext): Rule.RuleListener {
    const resolver = ResolverFactory.createResolver({
      fileSystem: fs,
      useSyncFileSystemCalls: true,
    });
    const modules
      = new WeakMap<visitor.AST.ImportModuleSpecifier, Set<string>>();
    const libs: { [key: string]: Set<string> } = {};
    return makeListener({
      import_module_specifier(node: visitor.AST.ImportModuleSpecifier) {
        let contents: string | null = null;
        try {
          const res = resolver.resolveSync(
            {},
            path.dirname(context.physicalFilename),
            node.value
          );
          if (res) {
            contents = fs.readFileSync(res, { encoding: "utf8" }) as string;
          }
        } catch (_err) {
          // Ignore
          // console.log(_err);
        }
        if (!contents) {
          context.report({
            node: n(node),
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
            node: n(node),
            messageId: "importNotParser",
            data: {
              import: node.value,
            },
          });
          return;
        }
        let startRules: string | undefined = undefined;
        if (parse[1].startsWith("peg$")) {
          // ESM
          startRules = contents.match(allowedStartESM)?.[1];
        } else {
          // CJS
          startRules = contents.match(allowedStartCJS)?.[1];
        }
        if (!startRules) {
          context.report({
            node: n(node),
            messageId: "importBadVersion",
            data: {
              import: node.value,
            },
          });
          return;
        }
        let mods: string[] | undefined = undefined;
        try {
          mods = JSON.parse(startRules);
        } catch {
          // Ignored
        }
        if (!mods
            || !Array.isArray(mods)
            || mods.length === 0
            || mods.some(v => (typeof v !== "string") || (v.length === 0))) {
          context.report({
            node: n(node),
            messageId: "importNotParser",
            data: {
              import: node.value,
            },
          });
          return;
        }
        modules.set(node, new Set(mods));
      },
      "grammar_import:exit": (node: visitor.AST.Import) => {
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
                  node: n(what.binding.id),
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
                  node: n(what.binding.id),
                  messageId: "importDuplicate",
                  data: {
                    "import": node.from.value,
                    "name": what.binding.id.value,
                  },
                });
              } else {
                libs[what.binding.id.value] = mods;
              }
              break;
            case "import_binding_default":
              // There is always a default rule
              break;
            case "import_binding_rename": {
              if (!mods.has(what.rename.value)) {
                context.report({
                  node: n(what.binding.id),
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
      library_ref(node: visitor.AST.LibraryReferenceExpression) {
        const mods = libs[node.library.value];
        if (!mods) {
          context.report({
            node: n(node.library),
            messageId: "importNameNotFound",
            data: {
              "export": node.library.value,
            },
          });
        } else if (!mods.has(node.name.value)) {
          context.report({
            node: n(node.name),
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

export default rule;
