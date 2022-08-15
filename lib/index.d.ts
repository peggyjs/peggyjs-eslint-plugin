import type ESlint from "eslint";
export declare const configs: {
    [key: string]: ESlint.ESLint.ConfigData<ESlint.Linter.RulesRecord>;
};
export declare const rules: {
    [name: string]: ESlint.Rule.RuleModule;
};
export declare const processors: {
    [key: string]: ESlint.Linter.Processor;
};
