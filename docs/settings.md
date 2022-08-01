# Settings for @peggyjs/eslint-plugin

There are several settings that control whitespace insertion when ESlint fixes
issues caught by this plugin.

- `"@peggyjs/indent"`: Either a number (the number of spaces to indent), "tab",
  to indent with tab characters (`"\t"`), or a string to use directly to indent.
  Note that the file will be re-parsed after code is fixed, so this should be
  some combination of tabs and spaces to ensure that the output is a valid
  Peggy grammar.  Default: `2`.
- `"@peggyjs/newline"`: A string used to separate lines.  On Windows, you might
  want this to be `"\r\n"`, but might not.  Everywhere else, you probably want
  `"\n"`.  Default: `"\n"`.
