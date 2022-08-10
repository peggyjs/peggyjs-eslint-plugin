import type ESlint from "eslint";
import fs from "fs";
import path from "path";

export const rules: { [name: string]: ESlint.Rule.RuleModule }
  = Object.fromEntries(
    fs
      .readdirSync(__dirname)
      .filter(fileName => fileName.endsWith(".js") && !fileName.startsWith("."))
      .map(fileName => fileName.replace(/\.js$/, ""))
      .map(ruleName => [
        ruleName,
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        require(path.join(__dirname, ruleName)).default,
      ])
  );
