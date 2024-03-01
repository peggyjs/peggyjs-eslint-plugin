"use strict";

const rule = require("../../lib/rules/no-unused-rules");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("no-unused-rules", rule, {
  valid: [
    {
      code: `
foo = bar
bar = "1"
`,
    },
    {
      code: `
import * as bar from "bar"
foo = bar.foo`,
    },
    {
      code: `
import bar from 'bar'
foo = bar`,
    },
    {
      code: `
import {bar} from 'bar'
foo = bar`,
    },
    {
      code: `
import {foo as bar} from 'bar'
foo = bar`,
    },
    {
      code: `
import {"foo" as bar} from 'bar'
foo = bar`,
    },
    {
      options: [{ filter: "^_" }],
      code: `
foo = _bar
baz = "boo"
_bar = "bar"`,
    },
  ],
  invalid: [
    {
      code: "foo = '1'\nbar = '2'",
      errors: [{ messageId: "unused" }],
    },
    {
      code: `
        import * as bar from "bar"
        foo = bart.foo`,
      errors: [{ messageId: "unusedImport" }],
    },
    {
      code: `
        import bar from "bar"
        foo = "1"`,
      errors: [{ messageId: "unusedImport" }],
    },
    {
      code: `
        import {bar} from "bar"
        foo = "1"`,
      errors: [{ messageId: "unusedImport" }],
    },
    {
      code: `
        import {foo as bar} from "bar"
        foo = "1"`,
      errors: [{ messageId: "unusedImport" }],
    },
    {
      code: `
        import {"foo" as bar} from "bar"
        foo = "1"`,
      errors: [{ messageId: "unusedImport" }],
    },
    {
      options: [{ filter: "^_" }],
      code: `
foo = _bar
baz = "boo"
_bar = "bar"
_boo = "boo"`,
      errors: [{ messageId: "unused" }],
    },
  ],
});
