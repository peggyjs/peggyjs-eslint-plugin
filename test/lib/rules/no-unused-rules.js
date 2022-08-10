"use strict";

const rule = require("../../../lib/rules/no-unused-rules").default;
const RuleTester = require("eslint").RuleTester;
const test = require("node:test");

RuleTester.it = test.it;
RuleTester.describe = test.describe;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("no-unused-rules", rule, {
  valid: [
    {
      code: `
foo = bar
bar = "1"
`,
    },
  ],
  invalid: [
    {
      code: "foo = '1'\nbar = '2'",
      errors: [{ messageId: "unused" }],
    },
  ],
});
