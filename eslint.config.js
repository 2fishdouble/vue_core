import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  skipFormatting,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "vue/no-unused-vars": "off", // ✅ 关闭 JS 层级未使用变量提示
      "@typescript-eslint/no-unused-vars": "off", // ✅ 关闭 TS 层级未使用变量提示
    },
  },
]);
