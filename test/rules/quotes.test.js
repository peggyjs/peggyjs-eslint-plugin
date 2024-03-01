"use strict";

const rule = require("../../lib/rules/quotes");
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
    {
      code: `\
import foo from "foo";
bar = foo`,
      options: ["double"],
    },
    {
      code: `\
import {"bar" as foo} from "foo";
bar = foo`,
      options: ["double"],
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
    {
      code: `\
import foo from 'foo';
bar = foo`,
      options: ["double"],
      errors: [{ messageId: "wrongQuotes" }],
      output: `\
import foo from "foo";
bar = foo`,
    },
    {
      code: `\
import {'bar' as foo} from "foo";
bar = foo`,
      options: ["double"],
      errors: [{ messageId: "wrongQuotes" }],
      output: `\
import {"bar" as foo} from "foo";
bar = foo`,
    },
  ],
});
