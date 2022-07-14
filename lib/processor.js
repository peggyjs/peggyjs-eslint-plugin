"use strict";

const { generate } = require("peggy");
const visitor = require("peggy/lib/compiler/visitor");
const { NEVER_MATCH } = require("peggy/lib/compiler/passes/inference-match-result");
const SourceChain = require("./sourcechain.js");

const sourceMaps = {};

function findFunctions(root) {
  const functions = [];

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

  const visit = visitor.build({
    rule(node) {
      visit(node.expression, {});
    },
    action(node, context) {
      const env = { ...context };
      visit(node.expression, env);
      const match = node.expression.match | 0;
      // Function only required if expression can match
      if (match !== NEVER_MATCH) {
        addFunction(false, env, node);
      }
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

function preprocess(text, filename) {
  const ast = generate(text, { grammarSource: filename, output: "ast" });
  const functions = findFunctions(ast);

  const doc = new SourceChain();
  doc.add(`\
"use strict";
`);

  if (ast.topLevelInitializer) {
    doc.add(ast.topLevelInitializer.code, ast.topLevelInitializer.codeLocation);
  }

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
      doc.add(param, paramLoc);
    }
    doc.add(") {");
    doc.add(fun.body, fun.location);
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

  const code = doc.toString();
  const jsFn = `${filename}/0.js`;
  sourceMaps[filename] = doc;
  return [{ text: code, filename: jsFn }];
}

function postprocess(messages, filename) {
  const map = sourceMaps[filename];
  delete sourceMaps[filename];

  return messages[0].flatMap(msg => {
    const start = map.originalLocation(msg);
    const end = map.originalLocation({
      line: msg.endLine,
      column: msg.endColumn - 1, // Take one off, so we don't go past the end
    });
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

module.exports = {
  preprocess,
  postprocess,
  supportsAutofix: false,
};
