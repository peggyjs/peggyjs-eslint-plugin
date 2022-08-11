"use strict";

const rule = require("../../lib/rules/equal-next-line").default;
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
      code: "foo      = '1'",
      options: [],
      errors: [{ messageId: "next" }],
      output: "foo\n  = '1'",
    },
    {
      code: "foo\n = '1'",
      options: ["never"],
      errors: [{ messageId: "same" }],
      output: "foo = '1'",
    },
    {
      code: "foo = '1'",
      options: ["always"],
      errors: [{ messageId: "next" }],
      output: "foo\n  = '1'",
    },
    {
      code: "foo\n = '1'",
      options: ["never", ["choice"]],
      errors: [{ messageId: "same" }],
      output: "foo = '1'",
    },
    {
      code: "foo = '1' / '2'",
      options: ["never", ["choice"]],
      errors: [{ messageId: "next" }],
      output: "foo\n  = '1' / '2'",
    },
    {
      code: "foo\n\n  = '1' / '2'",
      options: ["never", ["choice"]],
      errors: [{ messageId: "next" }],
      output: "foo\n  = '1' / '2'",
    },
    {
      code: "foo 'Foo has a name' = '1'",
      options: ["always"],
      errors: [{ messageId: "next" }],
      output: "foo 'Foo has a name'\n  = '1'",
    },
    {
      code: "foo 'Foo has a name'\n  = '1'",
      options: ["never"],
      errors: [{ messageId: "same" }],
      output: "foo 'Foo has a name' = '1'",
    },
    {
      code: "foo 'Foo has a name' = '1'",
      options: ["never", ["named"]],
      errors: [{ messageId: "next" }],
      output: "foo 'Foo has a name'\n  = '1'",
    },
    {
      code: "foo  'Foo has a name'\n\n  = '1'",
      options: ["never", ["named"]],
      errors: [{ messageId: "next" }],
      output: "foo  'Foo has a name'\n  = '1'",
    },
    {
      code: "foo  'Foo has a name'\n\n  = '1'",
      options: ["never", ["named"]],
      errors: [{ messageId: "next" }],
      settings: {
        "@peggyjs/indent": "tab",
        "@peggyjs/newline": "\r\n",
      },
      output: "foo  'Foo has a name'\r\n\t= '1'",
    },
    {
      code: "foo  'Foo has a name'\n\n  = '1'",
      options: ["never", ["named"]],
      errors: [{ messageId: "next" }],
      settings: {
        "@peggyjs/indent": "   ",
      },
      output: "foo  'Foo has a name'\n   = '1'",
    },
    {
      code: "foo  'Foo has a name'\n\n  = '1'",
      options: ["never", ["named"]],
      errors: [{ messageId: "next" }],
      settings: {
        "@peggyjs/indent": 3,
      },
      output: "foo  'Foo has a name'\n   = '1'",
    },
  ],
});
