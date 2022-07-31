import ESlint from "eslint";
import recommended from "./recommended";

export const configs: { [key: string]: ESlint.ESLint.ConfigData } = {
  recommended,
};
