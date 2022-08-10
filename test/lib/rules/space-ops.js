"use strict";

const rule = require("../../../lib/rules/space-ops").default;
const RuleTester = require("eslint").RuleTester;
const test = require("node:test");

RuleTester.it = test.it;
RuleTester.describe = test.describe;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("space-ops", rule, {
  valid: [
    {
      code: "foo = '1'",
    },
    {
      code: "foo\n  = '2'",
    },
    {
      code: "foo /* With comment */ \n  = '3'",
    },
    {
      code: "foo = /* With comment */ '3'",
    },
    {
      code: "foo 'With display name' = '4'",
    },
    {
      code: "op = '4'? '5'* '6'+",
    },
    {
      code: "prefix = $'a'i !'b' &'c'",
    },
    {
      code: "semantic = !{ return false; } &{ return true; }",
    },
    {
      code: "foo\n  = ( '1' / '2' )\n  / '3'",
    },
    {
      code: "foo 'With display name'\n  = ( '1' / '2' )\n  / '3'",
    },
    {
      code: "foo = ( '1'\n  / '2' )",
    },
    {
      code: "foo = lab:'1'",
    },
    {
      code: "foo = @'1' '2'",
    },
    {
      code: "foo = @lab:'1'",
    },
  ],

  invalid: [
    {
      code: "foo =\n  '5'",
      errors: [{ messageId: "exactSpace" }],
      output: "foo = '5'",
    },
    {
      code: "foo =  '6'",
      errors: [{ messageId: "exactSpace" }],
      output: "foo = '6'",
    },
    {
      code: "foo ='7'",
      errors: [{ messageId: "exactSpace" }],
      output: "foo = '7'",
    },
    {
      code: "op = '4'  ? '5'\n* '6'   +",
      errors: [
        { messageId: "noSpaces" },
        { messageId: "noSpaces" },
        { messageId: "noSpaces" },
      ],
      output: "op = '4'? '5'* '6'+",
    },
    {
      code: "prefix = $  'a'i !\n'b' &    'c'",
      errors: [
        { messageId: "noSpaces" },
        { messageId: "noSpaces" },
        { messageId: "noSpaces" },
      ],
      output: "prefix = $'a'i !'b' &'c'",
    },
    {
      code: "semantic = ! { return false; } &\n{ return true; }",
      errors: [
        { messageId: "noSpaces" },
        { messageId: "noSpaces" },
      ],
      output: "semantic = !{ return false; } &{ return true; }",
    },
    {
      code: "tight\n  = ( '1'/'2' )\n  /'3'",
      errors: [
        { messageId: "atLeast", data: { num: 1, s: "" } },
        { messageId: "exactSpace" },
        { messageId: "exactSpace" },
      ],
      output: "tight\n  = ( '1' / '2' )\n  / '3'",
      options: [],
    },
    {
      code: "foo\n  = ( '1'/\n\n'2' )\n  /'3'",
      errors: [
        { messageId: "exactSpace" },
        { messageId: "exactSpace" },
        { messageId: "exactSpace" },
      ],
      output: "foo\n  = ( '1' / '2' )\n  / '3'",
      options: [{ beforeSlash: 1 }],
    },
    {
      code: "foo = lab: '1'",
      errors: [
        { messageId: "noSpaces" },
      ],
      output: "foo = lab:'1'",
    },
    {
      code: "foo = lab:'1'",
      errors: [
        { messageId: "exactSpace", data: { num: 2, s: "s" } },
      ],
      output: "foo = lab:  '1'",
      options: [{ afterColon: 2 }],
    },
    {
      code: "foo = lab:'1'",
      errors: [
        { messageId: "atLeast", data: { num: 2, s: "s" } },
      ],
      output: "foo = lab:  '1'",
      options: [{ afterColon: -2 }],
    },
  ],
});
