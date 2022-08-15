"use strict";

const rule = require("../../lib/rules/quotes").default;
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("quotes", rule, {
  valid: [
    {
      code: 'Foo "one" = "1"',
    },
    {
      code: 'Foo "one" = "1"',
      options: ["double"],
    },
    {
      code: "Foo 'one' = '1'",
      options: ["single"],
    },
    {
      code: "Foo '\"' = '\"'",
      options: [{ style: "double", avoidEscape: true }],
    },
    {
      code: 'Foo "\'" = "\'"',
      options: [{ style: "single", avoidEscape: true }],
    },
  ],

  invalid: [
    {
      code: "Foo = '1'",
      errors: [{ messageId: "wrongQuotes" }],
      output: 'Foo = "1"',
    },
    {
      code: "Foo 'one' = \"1\"",
      errors: [{ messageId: "wrongQuotes" }],
      output: 'Foo "one" = "1"',
    },
    {
      code: "Foo = '1'",
      options: ["double"],
      errors: [{ messageId: "wrongQuotes" }],
      output: 'Foo = "1"',
    },
    {
      code: 'Foo = "1"',
      options: ["single"],
      errors: [{ messageId: "wrongQuotes" }],
      output: "Foo = '1'",
    },
    {
      code: 'Foo "one" = \'1\'',
      options: ["single"],
      errors: [{ messageId: "wrongQuotes" }],
      output: "Foo 'one' = '1'",
    },
    {
      code: 'Foo = \'"\'',
      options: [{ style: "double", avoidEscape: false }],
      errors: [{ messageId: "wrongQuotes" }],
      output: 'Foo = "\\""',
    },
    {
      code: 'Foo = "\'"',
      options: [{ style: "single", avoidEscape: false }],
      errors: [{ messageId: "wrongQuotes" }],
      output: "Foo = '\\''",
    },
  ],
});
