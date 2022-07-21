"use strict";

const assert = require("assert");
const test = require("node:test");
const processor = require("../lib/processor");

test("processor", () => {
  const res = processor.preprocess(`
{{
const ONE = Symbol("one");
}}
{
const NUM_T = options.numT ?? 2;
}
foo
  = o:"one" t:$"t"+ &{ return t.length > NUM_T; } !{ return t.length > 2 * NUM_T; } {
    return ONE;
  }
`, "processor.peggy");
  assert.equal(res.length, 2);

  const messages = [[], [{
    ruleId: "no-unused-vars",
    severity: 2,
    message: "'o' is defined but never used.",
    line: 31,
    column: 19,
    nodeType: "Identifier",
    messageId: "unusedVar",
    endLine: 31,
    endColumn: 20,
  }, {
    ruleId: "no-unused-vars",
    severity: 2,
    message: "'t' is defined but never used.",
    line: 31,
    column: 22,
    nodeType: "Identifier",
    messageId: "unusedVar",
    endLine: 31,
    endColumn: 23,
  }]];

  const mapped = processor.postprocess(messages, "processor.peggy");
  assert.equal(mapped.length, messages[1].length);
});

test("fix", () => {
  const res = processor.preprocess(`\
{{
const FOO = "foo";
}}

{
const BASE = options.base || 10
}

bar = first:pos  rest:("," @num)* { return [FOO, first, ...rest]; }

pos = n:num !{ return n > 0; }

num = n:$[0-9]+ { return parseInt(n, BASE); }

`, "fix.peggy");
  assert.equal(res.length, 2);

  const messages = [[], [
    {
      ruleId: "semi",
      severity: 2,
      message: "Missing semicolon.",
      line: 24,
      column: 34,
      nodeType: "VariableDeclaration",
      messageId: "missingSemi",
      endLine: 25,
      endColumn: 1,
      fix: { range: [476, 476], text: ";" },
    },
  ]];

  const mapped = processor.postprocess(messages, "fix.peggy");
  assert.equal(mapped.length, messages[1].length);
});
