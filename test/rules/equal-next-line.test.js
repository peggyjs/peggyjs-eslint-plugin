"use strict";

const rule = require("../../lib/rules/equal-next-line").default;
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("equal-next-line", rule, {
  valid: [
    {
      code: "foo = '1'",
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
      options: [{ style: "never", exceptions: ["choice"] }],
    },
    {
      code: "foo 'Foo has a name'\n  = '1'",
      options: [{ style: "never", exceptions: ["named"] }],
    },
  ],

  invalid: [
    {
      code: "foo      = '1'",
      options: ["always"],
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
      options: [{ style: "never", exceptions: ["choice"] }],
      errors: [{ messageId: "same" }],
      output: "foo = '1'",
    },
    {
      code: "foo = '1' / '2'",
      options: [{ style: "never", exceptions: ["choice"] }],
      errors: [{ messageId: "next" }],
      output: "foo\n  = '1' / '2'",
    },
    {
      code: "foo\n\n  = '1' / '2'",
      options: [{ style: "never", exceptions: ["choice"] }],
      errors: [{ messageId: "next" }],
      output: "foo\n  = '1' / '2'",
    },
    {
      code: "foo 'Foo has a name 1' = '1'",
      options: ["always"],
      errors: [{ messageId: "next" }],
      output: "foo 'Foo has a name 1'\n  = '1'",
    },
    {
      code: "foo 'Foo has a name 2'\n  = '1'",
      options: [{ style: "never", exceptions: [] }],
      errors: [{ messageId: "same" }],
      output: "foo 'Foo has a name 2' = '1'",
    },
    {
      code: "foo 'Foo has a name 3' = '1'",
      options: [{ style: "never", exceptions: ["named"] }],
      errors: [{ messageId: "next" }],
      output: "foo 'Foo has a name 3'\n  = '1'",
    },
    {
      code: "foo  'Foo has a name 4'\n\n  = '1'",
      options: [{ style: "never", exceptions: ["named"] }],
      errors: [{ messageId: "next" }],
      output: "foo  'Foo has a name 4'\n  = '1'",
    },
    {
      code: "foo  'Foo has a name 5'\n\n  = '1'",
      options: [{ style: "never", exceptions: ["named"] }],
      errors: [{ messageId: "next" }],
      settings: {
        "@peggyjs/indent": "tab",
        "@peggyjs/newline": "\r\n",
      },
      output: "foo  'Foo has a name 5'\r\n\t= '1'",
    },
    {
      code: "foo  'Foo has a name 6'\n\n  = '1'",
      options: [{ style: "never", exceptions: ["named"] }],
      errors: [{ messageId: "next" }],
      settings: {
        "@peggyjs/indent": "   ",
      },
      output: "foo  'Foo has a name 6'\n   = '1'",
    },
    {
      code: "foo  'Foo has a name 7'\n\n  = '1'",
      options: [{ style: "never", exceptions: ["named"] }],
      errors: [{ messageId: "next" }],
      settings: {
        "@peggyjs/indent": 3,
      },
      output: "foo  'Foo has a name 7'\n   = '1'",
    },
  ],
});
