// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      {
            rules: {
                  "no-unused-vars": "off",
                  "@typescript-eslint/no-unused-vars": "error",
                  "@typescript-eslint/no-var-requires": "error",
                  "no-console": "warn"
            }
      }
);