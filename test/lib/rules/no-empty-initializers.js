"use strict";

const rule = require("../../../lib/rules/no-empty-initializers").default;
const RuleTester = require("eslint").RuleTester;
const test = require("node:test");

RuleTester.it = test.it;
RuleTester.describe = test.describe;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("no-empty-initializers", rule, {
  valid: [
    {
      code: `
{{
const FOO = 1
}}

foo = "1" { return FOO; }
`
    },
    {
      code: `
{
function loc(obj) {
  obj.loc = location();
  return obj
}
}

foo = "1" { return loc({ type: "foo" }); }
`
    }
  ],
  invalid: [
    {
      code: "{{}}\n\nfoo = '1'",
      errors: [{ messageId: "empty" }],
      output: "\nfoo = '1'",
    },
    {
      code: "{  \n}\n\nfoo = '1'",
      errors: [{ messageId: "empty" }],
      output: "\nfoo = '1'",
    }
  ],
});
