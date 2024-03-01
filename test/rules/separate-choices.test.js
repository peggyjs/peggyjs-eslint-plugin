"use strict";

const rule = require("../../lib/rules/separate-choices");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("separate-choices", rule, {
  valid: [
    {
      code: "foo\n  = '1'\n  / '2'",
    },
    {
      code: "foo 'name here'\n  = '1'\n  / '2'",
    },
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
  ],
});
