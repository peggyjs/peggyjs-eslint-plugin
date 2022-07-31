import type ESlint from "eslint";
export * from "./configs";
export * from "./rules";
export declare const processors: {
    [key: string]: ESlint.Linter.Processor;
};
