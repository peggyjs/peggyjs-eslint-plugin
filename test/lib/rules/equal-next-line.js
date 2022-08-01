"use strict";

const rule = require("../../../lib/rules/equal-next-line").default;
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("equal-next-line", rule, {
  valid: [
    {
      code: "foo\n  = '1'",
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
      options: ["never", ["choice"]],
    },
    {
      code: "foo 'Foo has a name'\n  = '1'",
      options: ["never", ["named"]],
    },
  ],

  invalid: [
    {
      code: "foo = '1'",
      options: [],
      errors: [{ messageId: "next" }],
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
      options: ["never", ["choice"]],
      errors: [{ messageId: "same" }],
    },
    {
      code: "foo = '1' / '2'",
      options: ["never", ["choice"]],
      errors: [{ messageId: "next" }],
    },
    {
      code: "foo\n\n  = '1' / '2'",
      options: ["never", ["choice"]],
      errors: [{ messageId: "next" }],
    },
    {
      code: "foo 'Foo has a name' = '1'",
      options: ["never", ["named"]],
      errors: [{ messageId: "next" }],
    },
    {
      code: "foo  'Foo has a name'\n\n  = '1'",
      options: ["never", ["named"]],
      errors: [{ messageId: "next" }],
    },
  ],
});
