# @peggyjs/valid-imports

> All imports must point to correct JS files, compiled by Peggy 4.0.0 or later,
> which export the expected rule name as an allowedStartRule.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.

## 📖 Rule Details

This rule does a spot-check to see if a module that is imported with a set
of library rules will work.  It does NOT load the module with the node loader,
but it does read the file and ensure that:

- The file exists
- It looks like it is a Peggy parser
- It was compiled by a recent-enough version of Peggy that it can be used
  for library calls
- It was compiled with the correct rules marked as allowedStartRules

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/valid-imports: "error"
import * as bar from "NO_SUCH_FILE.js"
Bar = bar.boo
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/valid-imports: "error"
import {"foo" as bar} from "./bar.js"
foo = bar
```

## 🔎 Implementation

- [Rule source](../../src/rules/valid-imports.ts)
- [Test source](../../test/rules/valid-imports.test.js)
