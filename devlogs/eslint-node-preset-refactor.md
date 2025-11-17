# Devlog: Refactoring the ESLint `node` Preset

This devlog documents the process of refactoring the `@heygrady/eslint-config/node` preset for ESLint 9.x and the new flat config format.

## Current State of the `node` Preset (After Refactoring)

The `node.js` preset has been refactored to align with ESLint 9.x flat config format and to incorporate the user's feedback.

### Key Changes:

-   **`eslint-plugin-compat`**: This plugin has been removed as it was deemed unnecessary for a Node.js preset.
-   **`standard`**: The dependency on `standard` has been removed. The configuration now relies on recommended configs from individual plugins and carefully selected custom rules.
-   **`eslint.config.mjs`**: This file now simply extends the `node.js` preset, as requested by the user, making it a "meta package" that provides the default Node.js configuration.
-   **`prettier-config-standard`**: The import of `prettier-config-standard` in `.prettierrc.mjs` now uses the `import ... with { type: 'json' }` import attribute to resolve compatibility issues with ESLint's parser. A workaround using `load-prettier-config.cjs` was implemented to address parser limitations.
-   **`plugins` object**: All plugins are now correctly registered in the `plugins` object within the main config, and their recommended rules are spread into the `rules` object.
-   **`parserOptions`**: All `parserOptions` have been correctly nested under `languageOptions.parserOptions` in all override files.
-   **`import/enforce-node-protocol-usage`**: This rule has been added as a separate config object to ensure it's not overridden.
-   **`.cjs` file handling**: An override has been added to handle `.cjs` files as CommonJS modules.
-   **`import/resolver`**: The `typescript` resolver has been added to the `import/resolver` setting to correctly resolve `@typescript-eslint` packages.
-   **Custom Rules and Overrides**: All relevant custom rules from `lib/rules` and overrides from `lib/overrides` have been re-integrated into the `node.js` preset.
-   **Markdown file linting**: Markdown files are now correctly linted, and CommonJS code blocks within Markdown files are handled correctly.
-   **`package.json` linting**: `package.json` is now explicitly excluded from the linting process to prevent parsing errors.

The `node.js` preset is now in a working state with the current versions of the packages.

## Outdated Dependencies

A check for outdated dependencies in `packages/eslint-config` revealed that many dependencies and devDependencies are outdated. These packages have been upgraded to their latest versions using `yarn workspace @heygrady/eslint-config up`.

**Dependencies (Upgraded):**
-   `@testing-library/dom`: `^9.3.3` → `^10.4.1`
-   `eslint`: `^9.0.0` → `^9.39.1`
-   `eslint-import-resolver-typescript`: `^3.6.1` → `^4.4.4`
-   `eslint-plugin-compat`: `^4.2.0` → `^6.0.2`
-   `eslint-plugin-jest`: `^27.6.0` → `^29.1.0`
-   `eslint-plugin-jest-dom`: `^5.1.0` → `^5.5.0`
-   `eslint-plugin-json`: `^3.1.0` → `^4.0.1`
-   `eslint-plugin-jsx-a11y`: `^6.8.0` → `^6.10.2`
-   `eslint-plugin-markdown`: `^3.0.1` → `^5.1.0`
-   `eslint-plugin-prettier`: `^5.0.1` → `^5.5.4`
-   `eslint-plugin-promise`: `^6.1.1` → `^7.2.1`
-   `eslint-plugin-react`: `^7.33.2` → `^7.37.5`
-   `eslint-plugin-storybook`: `^0.8.0` → `^10.0.7`
-   `eslint-plugin-testing-library`: `^6.1.2` → `^7.13.4`
-   `eslint-plugin-vitest`: `^0.3.9` → `^0.5.4`
-   **`pkg-dir`**: This package has been replaced with `package-directory` due to deprecation.
-   `prettier`: `^3.0.3` → `^3.6.2`
-   `prettier-config-standard`: `^7.0.0` → `^7.0.0` (No change)
-   `typescript`: `^5.2.2` → `^5.9.3`
-   `vitest`: `^0.34.6` → `^4.0.9`

**DevDependencies (Upgraded):**
-   `lint-staged`: `^15.0.2` → `^16.2.6`
-   `rimraf`: `^5.0.5` → `^6.1.0`

## Detailed Analysis of the `node` Preset

### Plugins

- **`@eslint/js`**: This is the core ESLint plugin, and `js.configs.recommended` provides the base set of recommended rules. This is essential and will be kept.

- **`eslint-plugin-eslint-comments`**: This plugin provides rules for ESLint comments (e.g., `// eslint-disable-line`). The `recommended` config is used, which is a good practice. This will be kept.

- **`eslint-plugin-compat`**: This plugin checks for browser compatibility of APIs. As this is a Node.js preset, this plugin is not necessary and will be **removed**.

- **`eslint-plugin-n`**: This is the successor to `eslint-plugin-node` and provides rules for Node.js. The `recommended` config is used. This is essential for a Node.js preset and will be kept.

- **`eslint-plugin-import`**: This plugin lints ES6+ import/export syntax, and prevents issues with misspelling of file paths and import names. The `recommended` config is used. This is a very useful plugin and will be kept. The custom rules in `lib/rules/import.js` will be reviewed to see if they are still needed.

- **`eslint-plugin-jsdoc`**: This plugin provides linting rules for JSDoc comments. The `recommended` config is used. This is a good practice for maintaining documentation and will be kept. The custom rules in `lib/rules/jsdoc.js` will be reviewed.

- **`eslint-config-prettier`**: This config turns off all rules that are unnecessary or might conflict with Prettier. This is essential for using Prettier with ESLint and will be kept.

- **`eslint-plugin-markdown`**: This plugin allows linting of code blocks within Markdown files. This is useful for documentation and will be kept.

- **`eslint-plugin-json`**: This plugin provides linting for JSON files. The `recommended` config is used. This is useful and will be kept.

- **`eslint-plugin-jest`**: This plugin provides a set of ESLint rules for Jest test files. The `recommended` config is used. This is useful for projects that use Jest and will be kept.

### Custom Rules (`lib/rules`)

- **`lib/rules/common.js`**:
  ```javascript
  // common rules for all configs
  export default {
    'eslint-comments/no-unused-disable': 'error',
    'no-unused-vars': 'warn',
    'n/no-unpublished-import': 'off',
    'n/no-unpublished-require': 'off',
  }
  ```
  - `eslint-comments/no-unused-disable`: This is already in the `eslint-comments/recommended` config. **Redundant**.
  - `no-unused-vars`: The `recommended` config from `@eslint/js` already has this rule set to `error`. This customization changes it to `warn`. This is a reasonable customization and can be **kept**.
  - `n/no-unpublished-import` and `n/no-unpublished-require`: These rules are turned off. This might be because the monorepo structure causes false positives. This needs to be investigated further. For now, we will assume this is a necessary customization and **keep** it.

- **`lib/rules/import.js`**:
  ```javascript
  // common import rules for all configs
  export default {
    'import/no-default-export': 'warn',
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'unknown'],
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '..',
            group: 'parent',
          },
          {
            pattern: '.',
            group: 'sibling',
          },
          {
            pattern: '{**,.,..}/*.{css,less,scss,gif,jpg,png,svg}',
            group: 'index',
            position: 'after',
          },
        ],
      },
    ],
  }
  ```
  - `import/no-default-export`: This is a stylistic choice. It can be **kept**.
  - `import/order`: This is a very specific and useful ordering for imports. This is a great customization and should be **kept**.

- **`lib/rules/jsdoc.js`**:
  ```javascript
  // common jsdoc rules for all configs
  export default {
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/check-tag-names': ['warn', { definedTags: ['jsx'] }],
  }
  ```
  - `jsdoc/require-jsdoc`: This is a stylistic choice. It can be **kept**.
  - `jsdoc/check-tag-names`: This is a useful customization to allow the `@jsx` tag. It should be **kept**.

- **`lib/rules/node.js`**:
  ```javascript
  // common node rules for all configs
  export default {
    'n/no-process-exit': 'warn',
    'n/no-unpublished-import': 'off',
    'n/no-unpublished-require': 'off',
  }
  ```
  - `n/no-process-exit`: The `n/recommended` config has this set to `error`. This customization changes it to `warn`. This is a reasonable customization and can be **kept**.
  - `n/no-unpublished-import` and `n/no-unpublished-require`: These are the same as in `lib/rules/common.js`. **Redundant**.

- **`lib/rules/prettier.js`**:
  ```javascript
  import prettierrc from '../../.prettierrc.mjs';

  export default {
    'prettier/prettier': [
      'error',
      prettierrc,
      {
        usePrettierrc: false,
      },
    ],
  };
  ```
  - This rule is what integrates Prettier with ESLint. It's essential and will be **kept**.

### Overrides (`lib/overrides`)

- **`lib/overrides/configFiles.js`**: This override disables certain rules for config files (e.g., `*.config.js`, `*rc.js`). This is a good practice and should be **kept**.

- **`lib/overrides/jest.js`**: This override enables the Jest plugin and its recommended configs for test files. This is a good practice and should be **kept**.

- **`lib/overrides/json.js`**: This override enables the JSON plugin and its recommended config for JSON files. This is a good practice and should be **kept**.

- **`lib/overrides/markdown.js`**: This override enables the Markdown plugin and its recommended config for Markdown files. It also has specific overrides for code blocks within Markdown files. This is a good practice and should be **kept**.

### Summary of Proposed Changes

- **Remove**: `eslint-plugin-compat`.
- **Keep**: All other plugins.
- **Review and Keep/Merge**: The custom rules and overrides. The redundant rules will be removed.

The next step is to create a new `node.js` file that reflects these changes.
