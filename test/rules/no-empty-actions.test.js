"use strict";

const rule = require("../../lib/rules/no-empty-actions").default;
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("no-empty-actions", rule, {
  valid: [
    {
      code: "foo = '1' { return 1; }",
    },
  ],
  invalid: [
    {
      code: "foo = '1' {}",
      errors: [{ messageId: "empty" }],
      output: "foo = '1'",
    },
  ],
});
