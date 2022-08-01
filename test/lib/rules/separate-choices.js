"use strict";

const rule = require("../../../lib/rules/separate-choices").default;
const RuleTester = require("eslint").RuleTester;
const test = require("node:test");

RuleTester.it = test.it;
RuleTester.describe = test.describe;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("equal-next-line", rule, {
  valid: [
    {
      code: "foo\n  = '1'\n  / '2'",
    },
    {
      code: "foo 'name here'\n  = '1'\n  / '2'",
    }
  ],
  invalid: [
    {
      code: "foo\n  = '1' / '2'",
      errors: [{ messageId: "next" }],
      output: "foo\n  = '1'\n  / '2'",
    },
    {
      code: "foo 'name here'\n  = '1' / '2'",
      errors: [{ messageId: "next" }],
      output: "foo 'name here'\n  = '1'\n  / '2'",
    },
    {
      code: "foo 'name here'\r\n\t= '1' / '2'",
      errors: [{ messageId: "next" }],
      settings: {
        "@peggyjs/indent": "tab",
        "@peggyjs/newline": "\r\n",
      },
      output: "foo 'name here'\r\n\t= '1'\r\n\t/ '2'",
    },
  ]
});
