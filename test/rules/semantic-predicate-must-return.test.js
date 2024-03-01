"use strict";

const rule = require("../../lib/rules/semantic-predicate-must-return");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("semantic-predicate-must-return", rule, {
  valid: [
    {
      code: "foo = n:'1' !{ return n === '2' }",
    },
    {
      code: "foo = n:'1' &{ return n === '1' }",
    },
  ],

  invalid: [
    {
      code: "foo = n:'1' !{ n === '2' }",
      options: [],
      errors: [{ messageId: "mustReturn" }],
    },
    {
      code: "foo = n:'1' &{ n === '1' }",
      options: [],
      errors: [{ messageId: "mustReturn" }],
    },
    {
      code: `
foo = n:'1' &{
  const areturn = 1;
  console.log(areturn);
}`,
      options: [],
      errors: [{ messageId: "mustReturn" }],
    },
    {
      code: `
foo = n:'1' &{
  const returna = 1;
  console.log(returna);
}`,
      options: [],
      errors: [{ messageId: "mustReturn" }],
    },
  ],
});
