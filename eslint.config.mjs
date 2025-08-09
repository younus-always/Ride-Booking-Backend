// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      {
            rules: {
                  // --- TypeScript-Aware ---
                  "no-unused-vars": "off",
                  "@typescript-eslint/explicit-function-return-type": "off",
                  "@typescript-eslint/no-explicit-any": "warn",
                  "@typescript-eslint/no-empty-function": "warn",
                  "@typescript-eslint/no-non-null-assertion": "warn",
                  "@/semi": ["warn", "always"], // TypeScript-aware semicolon rule
                  "@typescript-eslint/no-var-requires": "error",
                  "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
                  "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],

                  // --- General JS rules still useful in TS ---
                  "eqeqeq": ["error", "always"],
                  "no-console": "warn",
                  "curly": ["error", "all"],
                  "quotes": ["error", "double"],
                  "comma-dangle": ["error", "never"],
                  "object-curly-spacing": ["error", "always"],
                  "array-bracket-spacing": ["error", "never"],
                  "no-trailing-spaces": "error",
                  "keyword-spacing": ["error", { "before": true, "after": true }],
                  "brace-style": ["error", "1tbs"]
            }
      }
);