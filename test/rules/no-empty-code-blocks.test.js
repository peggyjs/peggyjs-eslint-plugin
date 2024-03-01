"use strict";

const rule = require("../../lib/rules/no-empty-code-blocks");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("no-empty-code-blocks", rule, {
  valid: [
    "foo = '1' { return 1; }",
    "bar = &{  } '1'",
    "baz = !{  } '1'",
    {
      code: "bar = &{ return true; } '1'",
      options: ["semantic"],
    },
    {
      code: "baz = !{ return true; } '1'",
      options: ["semantic"],
    },
  ],
  invalid: [
    {
      code: "foo = '1' {}",
      errors: [{ messageId: "action" }],
      output: "foo = '1'",
    },
    {
      code: "bar = &{  } '1'",
      errors: [{ messageId: "predicate" }],
      options: ["semantic"],
      output: "bar =  '1'", // Fix extra space later
    },
    {
      code: "baz = !{  } '1'",
      errors: [{ messageId: "predicate" }],
      options: ["semantic"],
      output: "baz =  '1'", // Fix extra space later
    },
  ],
});
