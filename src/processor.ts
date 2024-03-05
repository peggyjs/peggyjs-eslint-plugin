import { Bias, SourceChain } from "./sourcechain";
import { parseForESLint, visitor } from "@peggyjs/eslint-parser";
import type ESlint from "eslint";
import dbg from "debug";

const debug = dbg("eslintrc:@peggyjs/processor");
const sourceMaps = new Map<string, SourceChain>();
const RETAIN_NEWLINES = /(?<=(?:\r?\n))/g;
const NON_EMPTY = /^(\s*)[^\r\n]+\r?\n?$/;

interface Parameters {
  [name: string]: visitor.AST.Name;
}

/**
 * Like peggy.ast.FunctionConst, but with paramater locations.
 */
interface Fun {
  /**
   * Is this function a semantic predicte?
   */
  predicate: boolean;
  /**
   * Parameter locations.
   */
  params?: Parameters;
  /**
   * Function code node.
   */
  body: visitor.AST.Code;
}

/**
 * Find all of the functions in the grammar AST, including the locations of
 * all of the labels that will be used as parameters to wrapper functions.
 * This is a very cut-down version of generate-bytecode.
 *
 * @param root Root of the AST.
 * @returns All of the found functions.
 */
function findFunctions(root: visitor.AST.Program): Fun[] {
  const functions: Fun[] = [];

  const v = new visitor.Visitor<Parameters>({
    rule(): Parameters {
      return {};
    },
    labeled(node, opts): undefined {
      if (node.name) { // Not merely plucked
        if (opts?.parentResult) {
          const nm = node.name.value;
          opts.parentResult[nm] = node.name;
        }
      }
      return undefined;
    },
    action(node, opts): Parameters {
      return { ...opts?.parentResult };
    },
    "action:exit": (node, opts): undefined => {
      functions.push({
        predicate: false,
        params: opts.thisResult,
        body: node.code,
      });
      return undefined;
    },
    "semantic_and:exit": (node, opts): undefined => {
      functions.push({
        predicate: true,
        params: opts.thisResult,
        body: node.code,
      });
      return undefined;
    },
    "semantic_not:exit": (node, opts): undefined => {
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
 * Extra work to indent a code block carefully.
 *
 * @param doc Output doc.
 * @param code Input code block.
 * @param spaces How many spaces to indent in the output.
 */
function indent(
  doc: SourceChain, code: visitor.AST.Code, spaces = 2
): void {
  const lines = code.value.split(RETAIN_NEWLINES);
  let excess = 0;

  // Take the indentation of the first non-empty line as "desired" indent,
  // we will normalize the output from there to the desired number of spaces.
  for (const line of lines) {
    const m = line.match(NON_EMPTY);
    if (m) {
      excess = m[1].length;
      break;
    }
  }
  let lineNum = 0;
  let offset = 0;
  if (lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[ \t]*$/, "");
  }
  const extra = "".padEnd(spaces - excess);
  let first = true;
  for (let line of lines) {
    const m = line.match(NON_EMPTY);
    let column = 0;
    if (m) {
      // Indent non-empty lines more, in case the first non-blank line wasn't
      // indented enough for us.
      if (extra && !first) {
        doc.add(extra);
      }
      // Trim the excess start
      column = Math.min(m[1].length, excess) - spaces;
      if (column > 0) {
        line = line.substring(column);
      } else {
        column = 0;
      }
    }

    doc.add(
      line,
      {
        source: code.loc.source || undefined,
        start: {
          line: code.loc.start.line + lineNum,
          column: column + (lineNum ? 0 : code.loc.start.column),
        },
        offset: code.range[0] + offset + column,
      }
    );
    offset += line.length + column; // We cut "column" spaces out
    lineNum++;
    first = false;
  }
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
export function preprocess(
  text: string, filename: string
): ESlint.Linter.ProcessorFile[] {
  const res = parseForESLint(text, { filePath: filename });
  const ast: visitor.AST.Program = res.ast as unknown as visitor.AST.Program;
  const functions = findFunctions(ast);

  const doc = new SourceChain();
  doc.add(`\
"use strict";
`);

  if (ast.body.topLevelInitializer) {
    indent(doc, ast.body.topLevelInitializer.code, 0);
  }

  // Environment that grammar JS is expecting, then use everything to avoid
  // "unused" lint errors.
  doc.add(`
function parse(input, options) {
  function text() { return ""; }

  function offset() { return 0; }

  function range() { return {}; }

  function location() { return {}; }

  function expected(description, location) {
    throw new Error(description + location);
  }

  function error(message, location) {
    throw new Error(message + location);
  }

  text();
  offset();
  location();
  range();
  expected();
  error(input, options);
`);

  if (ast.body.initializer) {
    indent(doc, ast.body.initializer.code);
  }

  let count = 0;
  for (const fun of functions) {
    // Not actually possible, just keeping TS happy.
    /* c8 ignore start */
    if (!fun.params) {
      continue;
    }
    /* c8 ignore stop */

    if (fun.body.value.replace(/\r?\n/g, "").trim() === "") {
      // Catch this with no-empty-code-blocks.
      continue;
    }
    doc.add(`\n  function peg$f${count++}(`);

    let first = true;
    for (const name of Object.values(fun.params)) {
      if (first) {
        first = false;
      } else {
        doc.add(",");
      }
      doc.add("\n    ");
      doc.add(name);
    }
    doc.add("\n  ) ");
    doc.add(fun.body.open);
    indent(doc, fun.body, 4);
    doc.add("  ");
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
  // require("fs").writeFileSync(`${filename}-1.js`, doc.toDebugString());

  sourceMaps.set(filename, doc);
  return [
    { text, filename },
    { text: docText, filename: `${filename}/0.js` },
  ];
}

function sourceMapMessages(
  messages: ESlint.Linter.LintMessage[],
  map: SourceChain
): ESlint.Linter.LintMessage[] {
  const res: ESlint.Linter.LintMessage[] = [];
  for (const msg of messages) {
    debug("Before: %o", msg);
    const start = map.originalLocation({
      line: msg.line,
      column: msg.column - 1, // Map is 0-based cols
    }, Bias.ERROR);
    debug("Start: %o", start);
    if (start) {
      msg.line = start.line;
      msg.column = start.column + 1; // Message is 1-based cols
    } else {
      debug("Cound't find start location column: %d line %d", msg.line, msg.column);
      continue;
    }

    const end
      = (typeof msg.endLine === "number") && (typeof msg.endColumn === "number")
        ? map.originalLocation({
          line: msg.endLine,
          column: msg.endColumn - 1,  // Map is 0-based cols
        }, Bias.GREATEST_LOWER_BOUND)
        : null;
    if (end) {
      msg.endLine = end.line;
      msg.endColumn = end.column + 1; // Message is 1-based cols
    } else {
      debug("Cound't find end location column: %d line %d", msg.endLine, msg.endColumn);
      continue;
    }
    if (msg.fix) {
      msg.fix.range = [
        map.originalOffset(msg.fix.range[0], Bias.LEAST_UPPER_BOUND),
        map.originalOffset(msg.fix.range[1], Bias.GREATEST_LOWER_BOUND),
      ];
    }
    debug("After: %o", msg);
    res.push(msg);
  }
  return res;
}

/**
 * Put all of the line/column numbers back into the original file.
 *
 * @param messages
 * @param {string} filename
 */
export function postprocess(
  messages: ESlint.Linter.LintMessage[][],
  filename: string
): ESlint.Linter.LintMessage[] {
  const map = sourceMaps.get(filename);
  if (!map) {
    throw new Error(`Map not found for "${filename}"`);
  }
  sourceMaps.delete(filename);

  return [
    ...messages[0],
    ...sourceMapMessages(messages[1], map),
  ];
}

export const supportsAutofix = true;
