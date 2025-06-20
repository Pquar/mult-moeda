import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  {
    ignores: [
      "*.d.ts",
      "**/coverage",
      "**/dist",
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-unused-vars": "off",
      "no-console": "off",
      "no-debugger": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off",
      "vue/require-prop-types": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  eslintConfigPrettier
);
