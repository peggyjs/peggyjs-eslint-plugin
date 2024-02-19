# @peggyjs/space-ops

> Consistent spacing around operators and other punctuation.
> - ⭐️ This rule is included in `plugin:@peggyjs/recommended` preset.
> - ✒️ This rule will fix all errors it finds.

## 📖 Rule Details

Peggy grammars tend to be somewhat punctuation-heavy, and become more so as
the programmer gets more familiar with Peggy features.  This rule attempts to
bring some order to spacing around that punctuation:

- Rules: how much space should there be after the equals sign?
- Postfix operators: should there be a space between their expression and the operator?
- Prefix operators: should there be a space between the operator and their expression?
- Choices: should there spaces around the slash?
- Groups: should there be spaces inside the parentheses?
- Labels: should there be spaces around the colon?

For each of these cases, you can set the number of spaces to 0 (mandatory no
space), &gt;0 (mandatory number of spaces, unless there is a comment), or
&lt;0 (at least this many spaces, unless there is a comment).  The defaults are:

```json
{
  "afterAmp": 0,
  "afterAt": 0,
  "afterBang": 0,
  "afterColon": 0,
  "afterDollar": 0,
  "afterEquals": 1,
  "afterOpenParen": -1,
  "afterSlash": 1,
  "beforeCloseBrace": -1,
  "beforeCloseParen": -1,
  "beforeColon": 0,
  "beforeOpenBrace": -1,
  "beforePlus": 0,
  "beforeQuestion": 0,
  "beforeSemi": 0,
  "beforeSlash": -1,
  "beforeStar": 0,
}
```

:-1: Examples of **incorrect** code for this rule:

```peg.js
// eslint @peggyjs/space-ops

foo = !  ("bar"/"baz")  ;
```

:+1: Examples of **correct** code for this rule:

```peg.js
// eslint @peggyjs/space-ops

foo = !( "bar" / "baz" );
```

### Options

The first option is an object that has a key for each kind of punctuation.
The value is a number (see above for meaning).

## 🔎 Implementation

- [Rule source](../../src/rules/space-ops.ts)
- [Test source](../../test/rules/space-ops.test.js)
