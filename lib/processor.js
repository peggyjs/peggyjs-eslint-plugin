"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsAutofix = exports.postprocess = exports.preprocess = void 0;
const eslint_parser_1 = require("@peggyjs/eslint-parser");
const sourcechain_1 = __importDefault(require("./sourcechain"));
const debug_1 = __importDefault(require("debug"));
const sourceMaps = {};
const RETAIN_NEWLINES = /(?<=(?:\r?\n))/g;
const debug = (0, debug_1.default)("eslintrc:@peggyjs/processor");
/**
 * Find all of the functions in the grammar AST, including the locations of
 * all of the labels that will be used as parameters to wrapper functions.
 * This is a very cut-down version of generate-bytecode.
 *
 * @param root Root of the AST.
 * @returns All of the found functions.
 */
function findFunctions(root) {
    const functions = [];
    const v = new eslint_parser_1.visitor.Visitor({
        rule() {
            return {};
        },
        labeled(node, opts) {
            if (node.name) { // Not merely plucked
                if (opts?.parentResult) {
                    const nm = node.name.value;
                    opts.parentResult[nm] = node.name;
                }
            }
            return undefined;
        },
        action(node, opts) {
            return { ...opts?.parentResult };
        },
        "action:exit": (node, opts) => {
            functions.push({
                predicate: false,
                params: opts.thisResult,
                body: node.code,
            });
            return undefined;
        },
        "semantic_and:exit": (node, opts) => {
            functions.push({
                predicate: true,
                params: opts.thisResult,
                body: node.code,
            });
            return undefined;
        },
        "semantic_not:exit": (node, opts) => {
            functions.push({
                predicate: true,
                params: opts.thisResult,
                body: node.code,
            });
            return undefined;
        },
    });
    v.visit(root);
    return functions;
}
/**
 * Use eslint extensibility to extract javascript from input peggy grammar,
 * generate a very simplified version of the compiled parser that has just
 * enough structure that valid grammar+js will lint clean.
 *
 * See:
 * https://eslint.org/docs/latest/developer-guide/working-with-plugins#processors-in-plugins
 *
 * @param text The contents of the grammar file.
 * @param filename The fully-qualified path name of the grammar file.
 * @returns Just one chunk, with everything pushed together.  The filename is
 *   the original filename + "0.js", which comes into play in configuring
 *   rules specific to the javascript in a grammar.
 */
function preprocess(text, filename) {
    const res = (0, eslint_parser_1.parseForESLint)(text, { filePath: filename });
    const ast = res.ast;
    const functions = findFunctions(ast);
    const doc = new sourcechain_1.default();
    doc.add(`\
"use strict";
`);
    const TLI = ast.body.topLevelInitializer;
    if (TLI) {
        if (TLI.code.value.replace(/\r?\n/g, "").trim()) {
            doc.add(TLI.code);
        }
    }
    // Environment that grammar JS is expecting, then use everything to avoid
    // "unused" lint errors.
    doc.add(`
function parse(input, options) {
  function text() { return ""; }

  function offset() { return 0; }

  function range() { return {}; }

  function location() { return {}; }

  function expected(description, location) { return description + location; }

  function error(message, location) { return message + location; }

  text();
  offset();
  location();
  range();
  expected();
  error(input, options);
`);
    if (ast.body.initializer) {
        // Extra work to indent carefully
        let lineNum = 0;
        let offset = 0;
        const code = ast.body.initializer.code;
        for (const line of code.value.split(RETAIN_NEWLINES)) {
            if (line.match(/^[^\r\n]+\r?\n/)) { // Non-empty
                doc.add("  ");
                doc.add(line, {
                    source: code.loc.source || undefined,
                    start: {
                        line: code.loc.start.line + lineNum,
                        column: 1,
                    },
                    offset: code.range[0] + offset + 1,
                });
                offset += line.length;
            }
            lineNum++;
        }
    }
    let count = 0;
    for (const fun of functions) {
        doc.add(`\n  function peg$f${count++}(`);
        let first = true;
        // Not actually possible, just keeping TS happy.
        /* c8 ignore start */
        if (!fun.params) {
            continue;
        }
        /* c8 ignore stop */
        for (const name of Object.values(fun.params)) {
            if (first) {
                first = false;
            }
            else {
                doc.add(", ");
            }
            doc.add(name);
        }
        doc.add(") {");
        doc.add(fun.body);
        doc.add("}\n");
    }
    // Make sure all actions are used, js-wise
    if (count > 0) {
        doc.add("\n");
        for (let i = 0; i < count; i++) {
            doc.add(`  peg$f${i}();\n`);
        }
    }
    doc.add(`\
}

parse("", {});
`);
    const docText = doc.toString();
    debug(docText);
    sourceMaps[filename] = doc;
    return [
        { text, filename },
        { text: docText, filename: `${filename}/0.js` },
    ];
}
exports.preprocess = preprocess;
/**
 * Put all of the line/column numbers back into the original file.
 *
 * @param messages
 * @param {string} filename
 */
function postprocess(messages, filename) {
    const map = sourceMaps[filename];
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete sourceMaps[filename];
    return [
        ...messages[0],
        ...messages[1].map(msg => {
            const start = map.originalLocation(msg);
            if (start) {
                msg.line = start.line;
                msg.column = start.column;
            }
            const end = (typeof msg.endLine === "number") && (typeof msg.endColumn === "number")
                ? map.originalLocation({
                    line: msg.endLine,
                    column: msg.endColumn - 1, // Take one off, so we don't go past the end
                })
                : null;
            if (end) {
                msg.endLine = end.line;
                msg.endColumn = end.column + 1; // Then add it back
            }
            if (msg.fix) {
                msg.fix.range = [
                    // Yes, I would have used map, but Typescript.
                    map.originalOffset(msg.fix.range[0]),
                    map.originalOffset(msg.fix.range[1]),
                ];
            }
            return msg;
        }),
    ];
}
exports.postprocess = postprocess;
exports.supportsAutofix = true;
