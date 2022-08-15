import * as processor from "./processor";
import type ESlint from "eslint";
import assert from "assert";
import { dirMap } from "./utils";

export const configs = dirMap(__dirname, "configs") as { [key: string]: ESlint.ESLint.ConfigData };
export const rules = dirMap(__dirname, "rules") as { [name: string]: ESlint.Rule.RuleModule };

function filterObject<T>(
  obj: { [id: string]: T }, callback: (key: T, value: any) => boolean
): object {
  return Object.fromEntries(
    Object
      .entries(obj)
      .filter(([k, v]) => callback(v, k))
      .map(([k]) => [`@peggyjs/${k}`, "error"])
  );
}

const recOverride = configs.recommended?.overrides?.[0];
assert(recOverride);
recOverride.rules = filterObject(
  rules, r => Boolean(r.meta?.docs?.recommended)
);

const allOverride = configs.all?.overrides?.[0];
assert(allOverride);
allOverride.rules = filterObject(rules, r => !r.meta?.docs?.recommended);

export const processors: { [key: string]: ESlint.Linter.Processor } = {
  "peggy": processor,
  ".peggy": processor,
  ".pegjs": processor,
};
