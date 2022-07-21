"use strict";

const rule = require("../../../lib/rules/equal-next-line");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("equal-next-line", rule, {
  valid: [
    {
      code: "foo = '1'",
      options: [],
    },
    {
      code: "foo = '1'",
      options: ["never"],
    },
    {
      code: "foo\n  = '1'",
      options: ["always"],
    },
    {
      code: "foo\n  = '1'\n  / '2'",
      options: ["choice"],
    },
  ],

  invalid: [
    {
      code: "foo\n = '1'",
      options: [],
      errors: [{ messageId: "same" }],
    },
    {
      code: "foo\n = '1'",
      options: ["never"],
      errors: [{ messageId: "same" }],
    },
    {
      code: "foo = '1'",
      options: ["always"],
      errors: [{ messageId: "next" }],
    },
    {
      code: "foo\n = '1'",
      options: ["choice"],
      errors: [{ messageId: "same" }],
    },
    {
      code: "foo = '1' / '2'",
      options: ["choice"],
      errors: [{ messageId: "next" }],
    },
  ],
});
