"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsAutofix = exports.postprocess = exports.preprocess = void 0;
const eslint_parser_1 = require("@peggyjs/eslint-parser");
const sourcechain_1 = __importDefault(require("./sourcechain"));
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)("eslintrc:@peggyjs/processor");
const sourceMaps = new Map();
const RETAIN_NEWLINES = /(?<=(?:\r?\n))/g;
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
            if (line.match(/^[^\r\n]+\r?\n/)) {
                // Indent non-empty lines.
                // If we wanted code in initializers to be indented in Peggy files,
                // we could remove all this complexity, but we'd have to outdent
                // top-level initializers.
                doc.add("  ");
            }
            doc.add(line, {
                source: code.loc.source || undefined,
                start: {
                    line: code.loc.start.line + lineNum,
                    column: 0,
                },
                offset: code.range[0] + offset + 1,
            });
            offset += line.length;
            lineNum++;
        }
    }
    let count = 0;
    for (const fun of functions) {
        if (fun.body.value.replace(/\r?\n/g, "").trim() === "") {
            // Catch this with no-empty-code-blocks.
            continue;
        }
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
                doc.add(",");
            }
            doc.add("\n    ");
            doc.add(name);
        }
        doc.add("\n  ) ");
        doc.add(fun.body.open);
        doc.add(fun.body);
        doc.add(fun.body.close);
        doc.add("\n");
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
    // When needed:
    // debug(docText);
    // require("fs").writeFileSync(`${filename}-0.js`, docText);
    sourceMaps.set(filename, doc);
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
    const map = sourceMaps.get(filename);
    if (!map) {
        throw new Error(`Map not found for "${filename}"`);
    }
    sourceMaps.delete(filename);
    return [
        ...messages[0],
        ...messages[1].map(msg => {
            debug("Before: %o", msg);
            const start = map.originalLocation({
                line: msg.line,
                column: msg.column - 1, // Map is 0-based cols
            });
            if (start) {
                msg.line = start.line;
                msg.column = start.column + 1; // Message is 1-based cols
            }
            else {
                msg.line = 1;
                msg.column = 1;
                debug("Cound't find start location column: %d line %d", msg.line, msg.column);
            }
            const end = (typeof msg.endLine === "number") && (typeof msg.endColumn === "number")
                ? map.originalLocation({
                    line: msg.endLine,
                    column: msg.endColumn - 1, // Map is 0-based cols
                })
                : null;
            if (end) {
                msg.endLine = end.line;
                msg.endColumn = end.column + 1; // Message is 1-based cols
            }
            else {
                debug("Cound't find end location column: %d line %d", msg.endLine, msg.endColumn);
                msg.endLine = undefined;
                msg.endColumn = undefined;
            }
            if (msg.fix) {
                msg.fix.range = [
                    // Yes, I would have used map, but Typescript.
                    map.originalOffset(msg.fix.range[0]),
                    map.originalOffset(msg.fix.range[1]),
                ];
            }
            debug("After: %o", msg);
            return msg;
        }),
    ];
}
exports.postprocess = postprocess;
exports.supportsAutofix = true;
