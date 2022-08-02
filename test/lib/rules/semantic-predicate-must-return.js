"use strict";

const rule = require("../../../lib/rules/semantic-predicate-must-return").default;
const RuleTester = require("eslint").RuleTester;
const test = require("node:test");

RuleTester.it = test.it;
RuleTester.describe = test.describe;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("semantic-predicate-must-return", rule, {
  valid: [
    {
      code: "foo = n:'1' !{ return n === '2' }",
    },
    {
      code: "foo = n:'1' &{ return n === '1' }",
    },
  ],

  invalid: [
    {
      code: "foo = n:'1' !{ n === '2' }",
      options: [],
      errors: [{ messageId: "mustReturn" }]
    },
    {
      code: "foo = n:'1' &{ n === '1' }",
      options: [],
      errors: [{ messageId: "mustReturn" }]
    },
  ],
});
