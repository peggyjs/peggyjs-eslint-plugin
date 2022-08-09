"use strict";

const rule = require("../../../lib/rules/camelCase").default;
const RuleTester = require("eslint").RuleTester;
const test = require("node:test");

RuleTester.it = test.it;
RuleTester.describe = test.describe;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("camelCase", rule, {
  valid: [
    {
      code: "Foo = '1'",
    },
    {
      code: "Foo = bar:'1'",
    },
    {
      code: "FOO_BAR = bar:'1'",
    },
    {
      code: "__FOO_BAR__ = bar:'1'",
    },
    {
      code: "__Foo__ = bar:'1'",
    },
  ],

  invalid: [
    {
      code: "Bar = foo\nfoo = '1'",
      errors: [{ messageId: "notInitialCap" }],
      output: "Bar = Foo\nFoo = '1'",
    },
    {
      code: "Bar = foo_bar\nfoo_bar = '1'",
      errors: [{ messageId: "notCamelCase" }],
      output: "Bar = FooBar\nFooBar = '1'",
    },
    {
      code: "Bar = _foo_bar_\n_foo_bar_ = '1'",
      errors: [{ messageId: "notCamelCase" }],
      output: "Bar = _FooBar_\n_FooBar_ = '1'",
    },
    {
      // Don't change to existing identifier
      code: "Bar = foo_bar\nfoo_bar = '1'\nFooBar = '2'",
      errors: [{ messageId: "notCamelCase" }],
      output: null,
    },
    {
      // Can't fix labels
      code: "Bar = foo_bar:'1'",
      errors: [{ messageId: "notCamelCase" }],
      output: null,
    },
    {
      // Can't fix labels
      code: "Bar = Foo:'1'",
      errors: [{ messageId: "initialCap" }],
      output: null,
    },
  ],
});
