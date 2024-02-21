"use strict";

const rule = require("../../lib/rules/valid-imports").default;
const RuleTester = require("eslint").RuleTester;

const filename = __filename;
const ruleTester = new RuleTester({
  parser: require.resolve("@peggyjs/eslint-parser"),
});

ruleTester.run("valid-imports", rule, {
  valid: [
    {
      code: `
      import foo from "./fixtures/foo.cjs"
      bar = foo
      `,
      filename,
    },
    {
      code: `
      import {Foo} from "./fixtures/foo.mjs"
      bar = Foo
      `,
      filename,
    },
    {
      code: `
      import {Foo as foot} from "./fixtures/foo.mjs"
      bar = foot
      `,
      filename,
    },
    {
      code: `
      import {"Foo" as foot} from "./fixtures/foo.mjs"
      bar = foot
      `,
      filename,
    },
    {
      code: `
      import * as f from "./fixtures/foo.mjs"
      bar = f.Foo
      `,
      filename,
    },
  ],
  invalid: [
    {
      code: `
      import foo from "./fixtures/DOES_NOT_EXIST.cjs"
      bar = foo
      `,
      filename,
      errors: [{ messageId: "importNotFound" }],
    },
    {
      code: `
      import foo from "/DOES_NOT_EXIST-${process.pid}.cjs"
      bar = foo
      `,
      filename,
      errors: [{ messageId: "importNotFound" }],
    },
    {
      code: `
      import foo from "../index.test"
      bar = foo
      `,
      filename,
      errors: [{ messageId: "importNotParser" }],
    },
    {
      code: `
      import foo from "./fixtures/badVersion.mjs"
      bar = foo
      `,
      filename,
      errors: [{ messageId: "importBadVersion" }],
    },
    {
      code: `
      import foo from "./fixtures/badVersion.cjs"
      bar = foo
      `,
      filename,
      errors: [{ messageId: "importBadVersion" }],
    },
    {
      code: `
      import {baz} from "./fixtures/foo.cjs"
      bar = baz
      `,
      filename,
      errors: [{ messageId: "importBadExport" }],
    },
    {
      code: `
      import {foof as foot} from "./fixtures/foo.mjs"
      bar = foot
      `,
      filename,
      errors: [{ messageId: "importBadExport" }],
    },
    {
      code: `
      import {"foof" as foot} from "./fixtures/foo.mjs"
      bar = foot
      `,
      filename,
      errors: [{ messageId: "importBadExport" }],
    },
    {
      code: `
      import * as f from "./fixtures/foo.mjs"
      import * as f from "./fixtures/foo.cjs"
      bar = f.Foo
      `,
      filename,
      errors: [{ messageId: "importDuplicate" }],
    },
    {
      code: `
      import * as f from "./fixtures/foo.mjs"
      bar = g.Foo
      `,
      filename,
      errors: [{ messageId: "importNameNotFound" }],
    },
    {
      code: `
      import * as f from "./fixtures/foo.mjs"
      bar = f.Foot
      `,
      filename,
      errors: [{ messageId: "importNameNotFound" }],
    },
    {
      code: `
      import * as f from "./fixtures/badAllowed.mjs"
      bar = f.Foo
      `,
      filename,
      errors: [{ messageId: "importNotParser" }, { messageId: "importNameNotFound" }],
    },
    {
      code: `
      import * as f from "./fixtures/badAllowed2.mjs"
      bar = f.Foo
      `,
      filename,
      errors: [{ messageId: "importNotParser" }, { messageId: "importNameNotFound" }],
    },
  ],
});
