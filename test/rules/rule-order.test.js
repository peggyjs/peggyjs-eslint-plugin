"use strict";

const rule = require("../../lib/rules/rule-order");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("rule-order", rule, {
  valid: [
    { code: "foo = bar\nbar = '1'" },
    { code: "foo = foo" },
    { code: "foo\n = foo" },
    { code: "foo\n = bar\nbar = foo" },
    { code: "foo\n = bar boo\nbar = foo\nboo = '1'" },
    { code: "foo\n = bar\nbar = baz\nbaz = foo" },
    { code: "foo = boo baz boo\nbaz = boo bar\nbar = boo foo\nboo = '1' boo2\nboo2 = '2'" },
  ],
  invalid: [
    {
      code: "foo = '1'\nbar = foo",
      errors: [
        {
          messageId: "order",
          data: { name: "foo" },
        },
      ],
    },
    {
      code: "foo = bloo\nbar = foo",
      errors: [
        {
          messageId: "order",
          data: { name: "foo" },
        },
      ],
    },
  ],
});
