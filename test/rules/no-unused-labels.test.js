"use strict";

const rule = require("../../lib/rules/no-unused-labels");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("no-unused-labels", rule, {
  valid: [
    "Foo = n:[0-9]+ { return parseInt(n, 10); }",
    "Foo = ( @n:[0-9]+ ',' { return parseInt(n, 10); } )+",
    "Foo = ( @$[0-9]+ ',' )+",
    "Foo = n:'1' &{ return n === 1; }",
  ],
  invalid: [
    {
      code: "Foo = n:[0-9]+",
      errors: [{ messageId: "unused", data: { name: "n" } }],
      output: "Foo = [0-9]+",
    },
    {
      code: "Foo = (n:[0-9]+) { return n; }",
      errors: [{ messageId: "unused", data: { name: "n" } }],
      output: "Foo = ([0-9]+) { return n; }",
    },
    {
      code: "Foo = (n:[0-9]+ / '-1') { return n; }",
      errors: [{ messageId: "unused", data: { name: "n" } }],
      output: "Foo = ([0-9]+ / '-1') { return n; }",
    },
  ],
});
