"use strict";

const rule = require("../../lib/rules/semi");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("semi", rule, {
  valid: [
    {
      code: "{{ const A = 1; }}\n{ const B = 2; }\nfoo = '1'",
    },
    {
      code: "foo 'named' = '1'\n",
    },
    {
      code: "{{ const A = 1; }};\n{ const B = 2; };\nfoo = '1';",
      options: ["always"],
    },
    {
      code: "foo 'named' = '1';\n",
      options: ["always"],
    },
  ],
  invalid: [
    {
      code: "{{ const A = 1; }};\n{ const B = 2; };\nfoo = '1';",
      output: "{{ const A = 1; }}\n{ const B = 2; }\nfoo = '1'",
      errors: [
        { messageId: "prohibited" },
        { messageId: "prohibited" },
        { messageId: "prohibited" },
      ],
    },
    {
      code: "{{ const A = 1; }};\n{ const B = 2; };\nfoo = '1';",
      output: "{{ const A = 1; }}\n{ const B = 2; }\nfoo = '1'",
      errors: [
        { messageId: "prohibited" },
        { messageId: "prohibited" },
        { messageId: "prohibited" },
      ],
      options: ["never"],
    },
    {
      code: "{{ const A = 1; }}\n{ const B = 2; }\nfoo = '1'",
      output: "{{ const A = 1; }};\n{ const B = 2; };\nfoo = '1';",
      errors: [
        { messageId: "required" },
        { messageId: "required" },
        { messageId: "required" },
      ],
      options: ["always"],
    },
    {
      code: "{{ const A = 1; }};;\n{ const B = 2; };;\nfoo = '1';;",
      output: "{{ const A = 1; }};\n{ const B = 2; };\nfoo = '1';",
      errors: [
        { messageId: "prohibited" },
        { messageId: "prohibited" },
        { messageId: "prohibited" },
      ],
      options: ["always"],
    },
    {
      code: "{{ const A = 1; }};;\n{ const B = 2; };;\nfoo = '1';;",
      output: "{{ const A = 1; }}\n{ const B = 2; }\nfoo = '1'",
      errors: [
        { messageId: "prohibited" },
        { messageId: "prohibited" },
        { messageId: "prohibited" },
      ],
      options: ["never"],
    },
  ],
});
