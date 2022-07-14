"use strict";

const peggy = require("peggy");
const SourceChain = require("./sourcechain.js");

/** @type {{[fileName: string]: SourceChain}} */
const sourceMaps = {};

/**
 * @typedef {Object} Fun Like peggy.ast.FunctionConst, but with paramater locations.
 * @property {boolean }predicate Is this function a predicte?
 * @property {{[paramName: string]: peggy.LocationRange}} params Parameter locations.
 * @property {string} body Function source.
 * @property {peggy.LocationRange} location Source code location.
 */

/**
 * Find all of the functions in the grammar AST, including the locations of
 * all of the labels that will be used as parameters to wrapper functions.
 * This is a very cut-down version of generate-bytecode.
 *
 * @param {import("peggy").ast.Grammar} root The root of the grammar AST.
 * @returns {Fun[]} All of the found functions.
 */
function findFunctions(root) {
  /** @type {Fun[]} */
  const functions = [];

  /**
   * Add a function to the list, with de-duping.
   *
   * @param {boolean} predicate Is this function a semantic predicate?
   * @param {Object.<string, peggy.LocationRange>} params Parameters
   * @param {peggy.ast.SemanticPredicate|peggy.ast.Action} node The code block
   *   that goes inside the function.
   * @returns {number}
   */
  function addFunction(predicate, params, node) {
    const func = {
      predicate,
      params,
      body: node.code,
      location: node.codeLocation,
    };
    const pattern = JSON.stringify(func);
    const index = functions.findIndex(f => JSON.stringify(f) === pattern);

    return index === -1 ? functions.push(func) - 1 : index;
  }

  const visit = peggy.compiler.visitor.build({
    rule(node) {
      visit(node.expression, {});
    },
    action(node, context) {
      const env = { ...context };
      visit(node.expression, env);
      // Don't worry about node.expression.match.  If it's NEVER_MATCH, that
      // is eventually a lint error.
      addFunction(false, env, node);
    },
    labeled(node, context) {
      let env = context;

      if (node.label) {
        env = { ...context };
        context[node.label] = node.labelLocation;
      }

      visit(node.expression, env);
    },
    semantic_and(node, context) {
      addFunction(true, context, node);
    },
    semantic_not(node, context) {
      addFunction(true, context, node);
    },
  });

  visit(root);
  return functions;
}

/**
 * Use eslint extensibility to extract javascript from input peggy grammar,
 * generate a very simplified version of the compiled parser that has just
 * enough structure that valid grammar+js will lint clean.
 *
 * See: https://eslint.org/docs/latest/developer-guide/working-with-plugins#processors-in-plugins
 *
 * @param {string} text The contents of the grammar file.
 * @param {string} filename The fully-qualified path name of the grammar file.
 * @returns {import("eslint").Linter.ProcessorFile[]} Just one chunk, with everything
 *   pushed together.  The filename is the original filename + "0.js", which
 *   comes into play in configuring rules specific to the javascript in
 *   a grammar.
 */
function preprocess(text, filename) {
  const ast = peggy.generate(text, { grammarSource: filename, output: "ast" });
  const functions = findFunctions(ast);

  const doc = new SourceChain();
  doc.add(`\
"use strict";
`);

  if (ast.topLevelInitializer) {
    doc.add(
      ast.topLevelInitializer.code,
      ast.topLevelInitializer.codeLocation.start
    );
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

  if (ast.initializer) {
    // Extra work to indent carefully
    let lineNum = 0;
    for (const line of ast.initializer.code.split("\n")) {
      if (lineNum > 0) {
        doc.add("\n");
      }
      if (line) {
        doc.add("  ");
        doc.add(
          line,
          {
            line: ast.initializer.codeLocation.start.line + lineNum,
            column: 1,
          }
        );
      }
      lineNum++;
    }
  }

  let count = 0;
  for (const fun of functions) {
    doc.add(`\n  function peg$f${count++}(`);
    let first = true;
    for (const [param, paramLoc] of Object.entries(fun.params)) {
      if (first) {
        first = false;
      } else {
        doc.add(", ");
      }
      doc.add(param, paramLoc.start);
    }
    doc.add(") {");
    doc.add(fun.body, fun.location.start);
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

  sourceMaps[filename] = doc;
  return [{ text: doc.toString(), filename: `${filename}/0.js` }];
}

/**
 * Put all of the line/column numbers back into the original file.
 *
 * @param {import("eslint").Linter.LintMessage[][]} messages
 * @param {string} filename
 * @returns {import("eslint").Linter.LintMessage[]}
 */
function postprocess(messages, filename) {
  const map = sourceMaps[filename];
  delete sourceMaps[filename];

  return messages[0].map(msg => {
    const start = map.originalLocation(msg);
    const end
      = (typeof msg.endLine === "number") && (typeof msg.endColumn === "number")
        ? map.originalLocation({
          line: msg.endLine,
          column: msg.endColumn - 1, // Take one off, so we don't go past the end
        })
        : null;
    if (!start || !end) {
      return msg;
    }
    return {
      ...msg,
      line: start.line,
      column: start.column,
      endLine: end.line,
      endColumn: end.column + 1, // Then add it back
    };
  });
}

/** @type {import("eslint").Linter.Processor} */
module.exports = {
  preprocess,
  postprocess,
  supportsAutofix: false,
};
