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
`, __filename);
  assert.equal(res.length, 1);

  const messages = [[{
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

  const mapped = processor.postprocess(messages, __filename);
  assert.equal(mapped.length, messages[0].length);
});
